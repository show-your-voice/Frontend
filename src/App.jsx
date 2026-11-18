import { useEffect, useMemo, useState } from 'react'
import { Navigate, Outlet, RouterProvider, createBrowserRouter, redirect, useMatches, useNavigate, useOutletContext, useParams, useRevalidator, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { ApiError, request } from './api/client.js'
import Header from './components/Header.jsx'
import OutlineButton from './components/OutlineButton.jsx'
import { fetchSession, logout } from './features/auth/authApi.js'
import LoginForm from './features/auth/LoginForm.jsx'
import SignupForm from './features/auth/SignupForm.jsx'
import ManagerInfoPage from './features/managers/ManagerInfoPage.jsx'
import FloorPlan from './features/school-map/FloorPlan.jsx'
import { schoolMapPreviewData, splitPlacesByDisplayType } from './features/school-map/schoolMapPreviewData.js'
import ReportDetail from './features/reports/ReportDetail.jsx'
import ReportForm from './features/reports/ReportForm.jsx'
import ReportList from './features/reports/ReportList.jsx'
import ManagerReportDetailPage from './features/reports/ManagerReportDetailPage.jsx'
import { fetchManagerReports } from './features/reports/reportApi.js'
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

const AssignedReportsToggle = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  min-height: 44px;
  color: ${({ theme }) => theme.report.color.body};
  font-size: ${({ theme }) => theme.report.font.mobileSmall};
  white-space: nowrap;
  cursor: pointer;

  input {
    appearance: none;
    display: grid;
    place-items: center;
    width: ${({ theme }) => theme.space[5]};
    height: ${({ theme }) => theme.space[5]};
    margin: 0;
    border: 1px solid ${({ theme }) => theme.report.color.accent};
    border-radius: ${({ theme }) => theme.radius.full};
    cursor: inherit;
  }

  input:checked { background: ${({ theme }) => theme.report.color.accent}; }
  input:checked::after {
    content: '';
    width: 8px;
    height: 5px;
    border: solid ${({ theme }) => theme.report.color.surface};
    border-width: 0 0 2px 2px;
    transform: translateY(-1px) rotate(-45deg);
  }
  input:focus-visible {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: 2px;
  }

  @media (forced-colors: active) {
    input { appearance: auto; }
    input:checked::after { content: none; }
  }
`

function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  function handleLogin(user) {
    const next = searchParams.get('next') ?? ''
    const [nextPath] = next.split('?')
    const managerPath = /^\/manager\/reports(?:\/\d+)?\/?$/.test(nextPath) ? next : '/manager/reports'
    const home = user.role === 'TEACHER' ? managerPath : '/'
    navigate(next === '/managers' ? next : home, { replace: true })
  }

  return <LoginForm onLogin={handleLogin} onSignupClick={() => navigate('/signup')} />
}

function SignupPage() {
  const navigate = useNavigate()

  return <SignupForm onSignup={() => navigate('/login', { replace: true })} onLoginClick={() => navigate('/login')} />
}

function HeaderLayout() {
  const navigate = useNavigate()
  const matches = useMatches()
  const header = [...matches].reverse().find((match) => match.handle?.header)?.handle.header
  const sessionMatch = matches.find((match) => ['manager', 'manager-directory'].includes(match.id))
  const account = sessionMatch?.loaderData
  const isTeacher = account?.role === 'TEACHER'
  const [reports, setReports] = useState(reportPreviewData)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await logout().catch(() => {})
    navigate('/login', { replace: true })
  }

  function deleteReport(reportId) {
    setReports((currentReports) => currentReports.filter((report) => report.id !== reportId))
  }

  return (
    <>
      {(!sessionMatch || account) && (
        <Header
          brand="너목보"
          navigationLabel={header?.navigationLabel ?? '교내 지도'}
          userName={account?.name ?? '김학생'}
          userRole={isTeacher ? '관리자' : undefined}
          variant={isTeacher ? 'admin' : 'user'}
          loggingOut={loggingOut}
          onLogout={handleLogout}
        />
      )}
      <Outlet context={{ reports, deleteReport }} />
    </>
  )
}

async function loadSession({ request }) {
  try {
    return await fetchSession()
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      const { pathname, search } = new URL(request.url)
      const next = pathname + search
      throw redirect(`/login?${new URLSearchParams({ next })}`)
    }
    throw error
  }
}

async function loadManager(args) {
  const user = await loadSession(args)
  return user.role === 'TEACHER' ? user : redirect('/')
}

function SessionLoading() {
  return <ReportPage><p role="status">로그인 정보를 확인하는 중이에요.</p></ReportPage>
}

function SessionError() {
  const { revalidate, state } = useRevalidator()

  return (
    <ReportPage>
      <section role="alert">
        <p>로그인 정보를 확인하지 못했어요.</p>
        <OutlineButton onClick={revalidate} disabled={state !== 'idle'}>다시 시도</OutlineButton>
      </section>
    </ReportPage>
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

function mapRequestError(error, subject) {
  return error instanceof ApiError && error.status === 401
    ? '로그인 후 다시 시도해 주세요.'
    : `${subject} 불러오지 못했습니다.`
}

function SchoolMapPage() {
  const [searchParams] = useSearchParams()
  const usePreview = searchParams.get('preview') === '1'
  return <SchoolMapContentPage key={String(usePreview)} usePreview={usePreview} />
}

function SchoolMapContentPage({ usePreview }) {
  const [livePlaces, setLivePlaces] = useState(null)
  const [placesError, setPlacesError] = useState('')
  const [placesAttempt, setPlacesAttempt] = useState(0)
  const [floorAttempt, setFloorAttempt] = useState(0)
  const [reportsAttempt, setReportsAttempt] = useState(0)
  const [liveFloor, setLiveFloor] = useState(null)
  const [liveReports, setLiveReports] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const places = usePreview ? schoolMapPreviewData.places : livePlaces
  const { floorPlaces, quickPlaces } = useMemo(() => splitPlacesByDisplayType(places ?? []), [places])
  const isLive = !usePreview
  const currentPlace = places?.find((place) => selectedPlace?.isLive === isLive && selectedPlace.id === place.id) ?? floorPlaces[0] ?? quickPlaces[0]
  const selectedPlaceId = currentPlace?.id
  const isFloor = floorPlaces.some((place) => place.id === selectedPlaceId) ||
    (currentPlace?.gridRows != null && currentPlace?.gridCols != null)
  const floorResult = liveFloor?.placeId === selectedPlaceId && liveFloor?.attempt === floorAttempt ? liveFloor : null
  const reportsResult = liveReports?.placeId === selectedPlaceId && liveReports?.attempt === reportsAttempt ? liveReports : null
  const placesLoading = isLive && livePlaces === null && !placesError

  useEffect(() => {
    if (usePreview) return
    let ignore = false
    request('/api/places').then((data) => {
      if (!Array.isArray(data)) throw new Error('Invalid places response')
      if (!ignore) setLivePlaces(data)
    }).catch((error) => {
      if (!ignore) setPlacesError(mapRequestError(error, '장소 목록을'))
    })
    return () => { ignore = true }
  }, [placesAttempt, usePreview])

  useEffect(() => {
    if (!isLive || selectedPlaceId == null || !isFloor) return
    let ignore = false
    request(`/api/places/${selectedPlaceId}/floor-plan`)
      .then((data) => { if (!ignore) setLiveFloor({ placeId: selectedPlaceId, attempt: floorAttempt, data }) })
      .catch((error) => {
        if (!ignore) setLiveFloor({ placeId: selectedPlaceId, attempt: floorAttempt, error: mapRequestError(error, '평면도를') })
      })
    return () => { ignore = true }
  }, [floorAttempt, isLive, isFloor, selectedPlaceId])

  useEffect(() => {
    if (!isLive || selectedPlaceId == null) return
    let ignore = false
    request(`/api/posts?placeId=${selectedPlaceId}`)
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Invalid reports response')
        if (!ignore) setLiveReports({ placeId: selectedPlaceId, attempt: reportsAttempt, data })
      })
      .catch((error) => {
        if (!ignore) setLiveReports({ placeId: selectedPlaceId, attempt: reportsAttempt, error: mapRequestError(error, '신고 목록을') })
      })
    return () => { ignore = true }
  }, [isLive, reportsAttempt, selectedPlaceId])

  const roomsById = useMemo(() => new Map(schoolMapPreviewData.rooms.map((room) => [room.id, room])), [])
  const selectedPlaceReports = useMemo(
    () => isLive
      ? (reportsResult?.data ?? [])
      : mapReportPreviewData.filter((report) => roomsById.get(report.room_id)?.place_id === selectedPlaceId),
    [isLive, reportsResult, roomsById, selectedPlaceId],
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
    if (placeId !== selectedPlaceId) {
      setLiveFloor(null)
      setLiveReports(null)
    }
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
        <FloorPlan
          floorPlaces={floorPlaces} quickPlaces={quickPlaces} selectedPlaceId={selectedPlaceId}
          onPlaceChange={changePlace} roomCounts={roomCounts} selectedRoom={roomSelection?.id}
          onRoomSelect={selectRoom} usePreview={usePreview} floorResult={floorResult}
          placesLoading={placesLoading} placesError={placesError}
          onRetryPlaces={() => { setPlacesError(''); setPlacesAttempt((attempt) => attempt + 1) }}
          onRetryFloor={() => setFloorAttempt((attempt) => attempt + 1)}
        />
        <ReportList
          reports={placeReports} selectedStatus={selectedStatus} onStatusChange={setSelectedStatus}
          isLoading={placesLoading || (isLive && selectedPlaceId != null && !reportsResult)}
          errorMessage={placesError || reportsResult?.error}
          onRetry={reportsResult?.error ? () => setReportsAttempt((attempt) => attempt + 1) : undefined}
          emptyMessage={selectedPlaceId == null ? '조회할 장소가 없습니다.' : undefined}
        />
      </SchoolMapContent>
    </SchoolMapLayout>
  )
}

function ManagerReportsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [requestVersion, setRequestVersion] = useState(0)
  const [result, setResult] = useState(null)
  const assignedOnly = searchParams.get('scope') !== 'all'
  const statusParam = searchParams.get('status')
  const selectedStatus = ['received', 'inProgress', 'completed'].includes(statusParam) ? statusParam : 'all'
  const currentResult = result?.assignedOnly === assignedOnly && result.version === requestVersion ? result : null

  useEffect(() => {
    let ignore = false

    fetchManagerReports({ assignedOnly })
      .then((reports) => {
        if (!ignore) setResult({ assignedOnly, version: requestVersion, reports })
      })
      .catch((error) => {
        if (!ignore) setResult({ assignedOnly, version: requestVersion, errorMessage: mapRequestError(error, '신고 목록을') })
      })

    return () => {
      ignore = true
    }
  }, [assignedOnly, requestVersion])

  function updateFilter(name, value) {
    const next = new URLSearchParams(searchParams)
    if (value == null) next.delete(name)
    else next.set(name, value)
    setSearchParams(next, { replace: true })
  }

  return (
    <SchoolMapLayout>
      <SchoolMapContent>
        <PendingMapRegion aria-hidden="true" />
        <ReportList
          reports={currentResult?.reports ?? []}
          title={assignedOnly ? '내 담당 신고' : '전체 불편 신고'}
          headingAction={(
            <AssignedReportsToggle>
              <input
                type="checkbox"
                checked={assignedOnly}
                onChange={(event) => updateFilter('scope', event.target.checked ? null : 'all')}
              />
              내 담당만 보기
            </AssignedReportsToggle>
          )}
          selectedStatus={selectedStatus}
          onStatusChange={(status) => updateFilter('status', status === 'all' ? null : status)}
          onSelectReport={(report) => navigate({ pathname: `/manager/reports/${report.id}`, search: searchParams.toString() })}
          isLoading={!currentResult}
          errorMessage={currentResult?.errorMessage}
          onRetry={() => setRequestVersion((version) => version + 1)}
          emptyMessage={assignedOnly ? '내게 배정된 신고가 없어요.' : '조회된 신고가 없어요.'}
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
        id: 'manager',
        path: '/manager/reports',
        loader: loadManager,
        HydrateFallback: SessionLoading,
        ErrorBoundary: SessionError,
        handle: { header: { navigationLabel: '불편 신고' } },
        children: [
          { index: true, element: <ManagerReportsPage /> },
          { path: ':reportId', element: <ManagerReportDetailPage /> },
        ],
      },
      {
        id: 'manager-directory',
        path: '/managers',
        loader: loadSession,
        HydrateFallback: SessionLoading,
        ErrorBoundary: SessionError,
        element: <ManagerInfoPage />,
        handle: { header: { navigationLabel: '담당자 정보' } },
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
