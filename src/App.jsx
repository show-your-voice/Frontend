import { useEffect, useMemo, useState } from 'react'
import { Navigate, Outlet, RouterProvider, createBrowserRouter, useMatches, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { request } from './api/client.js'
import Header from './components/Header.jsx'
import LoginForm from './features/auth/LoginForm.jsx'
import SignupForm from './features/auth/SignupForm.jsx'
import ManagerInfoPage from './features/managers/ManagerInfoPage.jsx'
import { managerPreviewData } from './features/managers/managerPreviewData.js'
import FloorPlan from './features/school-map/FloorPlan.jsx'
import { schoolMapPreviewData, splitPlacesByDisplayType } from './features/school-map/schoolMapPreviewData.js'
import ReportDetail from './features/reports/ReportDetail.jsx'
import ReportForm from './features/reports/ReportForm.jsx'
import ReportList from './features/reports/ReportList.jsx'
import ManagerReportDetailPage from './features/reports/ManagerReportDetailPage.jsx'
import { fetchAllReports } from './features/reports/reportApi.js'
import { mapReportPreviewData, reportDetailPreviewData, reportPreviewData } from './features/reports/reportPreviewData.js'

const ReportPage = styled.main`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: calc(100dvh - 64px);
  padding: ${({ theme, $detail }) => $detail ? 0 : theme.report.layout.pagePadding};
  background: ${({ theme, $detail }) => $detail ? theme.report.color.surface : theme.report.color.background};
  font-family: ${({ theme }) => theme.report.font.family};
  color-scheme: light;

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    padding: ${({ theme, $detail }) => $detail ? 0 : theme.space[3]};
  }
`

const SchoolMapLayout = styled.main`
  height: calc(100dvh - 64px);
  overflow: hidden;
  background: ${({ theme }) => theme.schoolMap.color.background};
  color: ${({ theme }) => theme.schoolMap.color.text};
  font-family: ${({ theme }) => theme.schoolMap.font.family};

  @media (max-width: 980px) {
    height: auto;
    min-height: calc(100dvh - 64px);
    overflow: visible;
  }
`

const SchoolMapContent = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 20px;
  height: 100%;
  padding: 8px 20px;
  overflow: hidden;

  @media (max-width: 980px) { height: auto; min-height: 100%; grid-template-columns: 1fr; overflow: visible; }
`

const PendingMapRegion = styled.div`
  min-width: 0;

  @media (max-width: 980px) {
    display: none;
  }
`

function LoginPage() {
  const navigate = useNavigate()

  return <LoginForm onLogin={() => navigate('/', { replace: true })} onSignupClick={() => navigate('/signup')} />
}

function SignupPage() {
  const navigate = useNavigate()

  return <SignupForm onSignup={() => navigate('/login', { replace: true })} onLoginClick={() => navigate('/login')} />
}

function HeaderLayout() {
  const matches = useMatches()
  const header = [...matches].reverse().find((match) => match.handle?.header)?.handle.header
  const [reports, setReports] = useState(reportPreviewData)

  function deleteReport(reportId) {
    setReports((currentReports) => currentReports.filter((report) => report.id !== reportId))
  }

  return (
    <>
      <Header
        brand="너목보"
        navigationLabel={header?.navigationLabel ?? '교내 지도'}
        userName={header?.userName ?? '김학생'}
        userRole={header?.userRole}
        variant={header?.variant ?? 'user'}
      />
      <Outlet context={{ reports, deleteReport }} />
    </>
  )
}

function ReportDetailPage() {
  const navigate = useNavigate()
  const { reportId } = useParams()
  const { reports, deleteReport } = useOutletContext()
  const report = reports.find((item) => String(item.id) === reportId)

  if (!report) return <Navigate to="/" replace />

  function deleteAndReturnToList() {
    deleteReport(report.id)
    navigate('/', { replace: true })
  }

  return <ReportPage $detail><ReportDetail report={{ ...report, ...reportDetailPreviewData[report.id] }} onBack={() => navigate('/')} onDelete={deleteAndReturnToList} /></ReportPage>
}

function ReportCreatePage() {
  const navigate = useNavigate()

  return <ReportForm onCancel={() => navigate('/')} />
}

function toReportCard(report, room, place) {
  const statusByValue = {
    UNRESOLVED: { tone: 'received', label: '접수' },
    IN_PROGRESS: { tone: 'inProgress', label: '처리 중' },
    RESOLVED: { tone: 'completed', label: '처리 완료' },
  }

  return {
    id: report.id,
    title: report.title,
    description: report.content,
    date: (report.receivedAt ?? report.created_at)?.slice(0, 10) ?? '',
    author: report.authorName ?? report.author_name ?? '',
    location: room && place ? `${place.name} · ${room.name}` : report.roomName ? `${report.placeName} · ${report.roomName}` : '',
    status: statusByValue[report.status?.code ?? report.status] ?? report.status,
  }
}

function isActiveReport(report) {
  return ['UNRESOLVED', 'IN_PROGRESS'].includes(report.status?.code ?? report.status)
}

function SchoolMapPage() {
  const [livePlaces, setLivePlaces] = useState(null)
  const [liveFloor, setLiveFloor] = useState(null)
  const [liveReports, setLiveReports] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const places = livePlaces ?? schoolMapPreviewData.places
  const { floorPlaces, quickPlaces } = useMemo(() => splitPlacesByDisplayType(places), [places])
  const isLive = livePlaces !== null
  const currentPlace = places.find((place) => selectedPlace?.isLive === isLive && selectedPlace.id === place.id) ?? floorPlaces[0] ?? quickPlaces[0]
  const selectedPlaceId = currentPlace?.id
  const isFloor = floorPlaces.some((place) => place.id === selectedPlaceId) ||
    (currentPlace?.gridRows != null && currentPlace?.gridCols != null)
  const floorResult = liveFloor?.placeId === selectedPlaceId ? liveFloor : null

  useEffect(() => {
    let ignore = false
    request('/api/places').then((data) => {
      if (!ignore && Array.isArray(data)) setLivePlaces(data)
    }).catch(() => {})
    return () => { ignore = true }
  }, [])

  useEffect(() => {
    if (!isLive || selectedPlaceId == null) return

    let ignore = false
    if (isFloor) {
      request(`/api/places/${selectedPlaceId}/floor-plan`)
        .then((data) => { if (!ignore) setLiveFloor({ placeId: selectedPlaceId, data }) })
        .catch(() => { if (!ignore) setLiveFloor({ placeId: selectedPlaceId, data: null }) })
    }
    request(`/api/posts?placeId=${selectedPlaceId}`)
      .then((data) => { if (!ignore) setLiveReports({ placeId: selectedPlaceId, data: Array.isArray(data) ? data : [] }) })
      .catch(() => { if (!ignore) setLiveReports({ placeId: selectedPlaceId, data: [] }) })
    return () => { ignore = true }
  }, [isLive, isFloor, selectedPlaceId])

  const roomsById = useMemo(() => new Map(schoolMapPreviewData.rooms.map((room) => [room.id, room])), [])
  const selectedPlaceReports = useMemo(
    () => isLive
      ? (liveReports?.placeId === selectedPlaceId ? (liveReports?.data ?? []) : [])
      : mapReportPreviewData.filter((report) => roomsById.get(report.room_id)?.place_id === selectedPlaceId),
    [isLive, liveReports, roomsById, selectedPlaceId],
  )
  const activePlaceReports = useMemo(() => selectedPlaceReports.filter(isActiveReport), [selectedPlaceReports])
  const roomCounts = useMemo(() => {
    const counts = new Map()
    for (const report of activePlaceReports) {
      const key = report.roomId ?? report.room_id
      if (key != null) counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return counts
  }, [activePlaceReports])
  const roomSelection = selectedRoom?.placeId === selectedPlaceId && selectedRoom?.isLive === isLive ? selectedRoom : null
  const placeReports = useMemo(
    () => (roomSelection === null ? activePlaceReports : selectedPlaceReports)
      .filter((report) => roomSelection === null || roomSelection.id === (report.roomId ?? report.room_id))
      .map((report) => toReportCard(report, roomsById.get(report.room_id), currentPlace)),
    [activePlaceReports, currentPlace, roomSelection, roomsById, selectedPlaceReports],
  )

  function changePlace(placeId) {
    setSelectedPlace({ id: placeId, isLive })
    setSelectedRoom(null)
    setSelectedStatus('all')
  }

  function selectRoom(roomId) {
    setSelectedRoom(roomSelection?.id === roomId ? null : { id: roomId, placeId: selectedPlaceId, isLive })
    setSelectedStatus('all')
  }

  return (
    <SchoolMapLayout>
      <SchoolMapContent>
        <FloorPlan floorPlaces={floorPlaces} quickPlaces={quickPlaces} selectedPlaceId={selectedPlaceId} onPlaceChange={changePlace} roomCounts={roomCounts} selectedRoom={roomSelection?.id} onRoomSelect={selectRoom} usePreview={!isLive} floorResult={floorResult} />
        <ReportList reports={placeReports} selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
      </SchoolMapContent>
    </SchoolMapLayout>
  )
}

function ManagerReportsPage() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [requestVersion, setRequestVersion] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let ignore = false

    fetchAllReports()
      .then((nextReports) => {
        if (!ignore) setReports(nextReports)
      })
      .catch(() => {
        if (!ignore) setErrorMessage('신고 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [requestVersion])

  function retryReports() {
    setIsLoading(true)
    setErrorMessage('')
    setRequestVersion((version) => version + 1)
  }

  return (
    <SchoolMapLayout>
      <SchoolMapContent>
        <PendingMapRegion aria-hidden="true" />
        <ReportList
          reports={reports}
          title="내 담당 신고"
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onSelectReport={(report) => navigate(`/manager/reports/${report.id}`)}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onRetry={retryReports}
          emptyMessage="조회된 신고가 없어요."
        />
      </SchoolMapContent>
    </SchoolMapLayout>
  )
}

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  {
    element: <HeaderLayout />,
    children: [
      { path: '/reports/:reportId', element: <ReportDetailPage />, handle: { header: { navigationLabel: '불편 신고' } } },
      { path: '/reports/new', element: <ReportCreatePage />, handle: { header: { navigationLabel: '신고 작성' } } },
      { index: true, element: <SchoolMapPage />, handle: { header: { navigationLabel: '교내 지도' } } },
      {
        path: '/manager/reports',
        element: <ManagerReportsPage />,
        handle: { header: { navigationLabel: '교내 지도', userName: '이선생', userRole: '관리자', variant: 'admin' } },
      },
      {
        path: '/manager/reports/:reportId',
        element: <ManagerReportDetailPage />,
        handle: { header: { navigationLabel: '교내 지도', userName: '이선생', userRole: '관리자', variant: 'admin' } },
      },
      { path: '/managers', element: <ManagerInfoPage managers={managerPreviewData} />, handle: { header: { navigationLabel: '담당자 정보' } } },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
