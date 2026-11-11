import { useMemo, useState } from 'react'
import { Navigate, Outlet, RouterProvider, createBrowserRouter, useMatches, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import styled from 'styled-components'
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

  @media (max-width: 980px) { overflow-y: auto; }
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
      <Header brand="너목보" navigationLabel={header?.navigationLabel ?? '교내 지도'} userName="김학생" variant="user" />
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
    date: report.created_at?.slice(0, 10) ?? '',
    author: report.author_name ?? '',
    location: room && place ? `${place.name} · ${room.name}` : '',
    status: statusByValue[report.status] ?? report.status,
  }
}

function isActiveReport(report) {
  return ['UNRESOLVED', 'IN_PROGRESS'].includes(report.status)
}

function SchoolMapPage({ places = schoolMapPreviewData.places, rooms = schoolMapPreviewData.rooms, reports = mapReportPreviewData }) {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const { floorPlaces, quickPlaces } = useMemo(() => splitPlacesByDisplayType(places), [places])
  const roomsById = useMemo(() => new Map(rooms.map((room) => [room.id, room])), [rooms])
  const placesById = useMemo(() => new Map(places.map((place) => [place.id, place])), [places])
  const [selectedPlaceId, setSelectedPlaceId] = useState(floorPlaces[0]?.id)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const selectedPlaceReports = useMemo(
    () => reports.filter((report) => String(roomsById.get(report.room_id)?.place_id) === String(selectedPlaceId)),
    [reports, roomsById, selectedPlaceId],
  )
  const activePlaceReports = useMemo(() => selectedPlaceReports.filter(isActiveReport), [selectedPlaceReports])
  const roomCounts = useMemo(() => {
    const counts = new Map()
    for (const report of activePlaceReports) {
      const name = roomsById.get(report.room_id)?.name
      if (name) counts.set(name, (counts.get(name) ?? 0) + 1)
    }
    return counts
  }, [activePlaceReports, roomsById])
  const placeReports = useMemo(
    () => (selectedRoom === null ? activePlaceReports : selectedPlaceReports)
      .filter((report) => {
        const room = roomsById.get(report.room_id)
        return selectedRoom === null || selectedRoom.names.includes(room?.name)
      })
      .map((report) => {
        const room = roomsById.get(report.room_id)
        return toReportCard(report, room, placesById.get(room?.place_id))
      }),
    [activePlaceReports, selectedPlaceReports, selectedRoom, roomsById, placesById],
  )

  function changePlace(placeId) {
    setSelectedPlaceId(placeId)
    setSelectedRoom(null)
    setSelectedStatus('all')
  }

  function selectRoom(areaId, names) {
    setSelectedRoom((currentRoom) => currentRoom?.id === areaId ? null : { id: areaId, names })
    setSelectedStatus('all')
  }

  return (
    <SchoolMapLayout>
      <SchoolMapContent>
        <FloorPlan floorPlaces={floorPlaces} quickPlaces={quickPlaces} selectedPlaceId={selectedPlaceId} onPlaceChange={changePlace} roomCounts={roomCounts} selectedRoom={selectedRoom?.id} onRoomSelect={selectRoom} />
        <ReportList reports={placeReports} selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
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
      { path: '/managers', element: <ManagerInfoPage managers={managerPreviewData} />, handle: { header: { navigationLabel: '담당자 정보' } } },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
