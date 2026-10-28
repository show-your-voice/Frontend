import { useMemo, useState } from 'react'
import styled from 'styled-components'
import Header from '../../components/Header.jsx'
import FloorPlanViewer from '../../features/floor-plans/FloorPlanViewer.jsx'
import { floorPlanPreviewData, splitPlacesByDisplayType } from '../../features/floor-plans/floorPlanPreviewData.js'
import ReportList from '../../features/reports/ReportList.jsx'
import { mapReportPreviewData } from '../../features/reports/reportPreviewData.js'

const Page = styled.main`
  height: 100dvh;
  overflow: hidden;
  background: #fdf1f6;
  color: #2e2c2d;
  font-family: ${({ theme }) => theme.report.font.family};
`

const Content = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 20px;
  height: calc(100dvh - 64px);
  padding: 16px 20px 20px;
  overflow: hidden;

  @media (max-width: 980px) { height: auto; min-height: calc(100dvh - 64px); grid-template-columns: 1fr; overflow: visible; }
`

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

function pinId(report) {
  const x = Number(report.pos_x)
  const y = Number(report.pos_y)
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null
  const toPercent = (value) => value >= 0 && value <= 1 ? value * 100 : value
  return `${toPercent(x).toFixed(4)}:${toPercent(y).toFixed(4)}`
}

export default function CampusMapPage({ places = floorPlanPreviewData.places, rooms = floorPlanPreviewData.rooms, reports = mapReportPreviewData }) {
  const { floorPlaces, quickPlaces } = useMemo(() => splitPlacesByDisplayType(places), [places])
  const roomsById = useMemo(() => new Map(rooms.map((room) => [room.id, room])), [rooms])
  const placesById = useMemo(() => new Map(places.map((place) => [place.id, place])), [places])
  const [selectedPlaceId, setSelectedPlaceId] = useState(floorPlaces[0]?.id)
  const [selectedPinId, setSelectedPinId] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const selectedPlaceReports = useMemo(
    () => reports
      .filter((report) => String(roomsById.get(report.room_id)?.place_id) === String(selectedPlaceId)),
    [reports, roomsById, selectedPlaceId],
  )
  const placeReports = useMemo(
    () => selectedPlaceReports
      .filter((report) => selectedPinId === null || pinId(report) === selectedPinId)
      .map((report) => {
        const room = roomsById.get(report.room_id)
        return toReportCard(report, room, placesById.get(room?.place_id))
      }),
    [selectedPlaceReports, selectedPinId, roomsById, placesById],
  )

  function changePlace(placeId) {
    setSelectedPlaceId(placeId)
    setSelectedPinId(null)
  }

  function selectPin(pinId) {
    if (pinId === null) {
      setSelectedPinId(null)
      return
    }

    setSelectedPinId((currentPinId) => currentPinId === pinId ? null : pinId)
  }

  return (
    <Page>
      <Header brand="너목보" navigationLabel="교내 지도" userName="김학생" variant="user" />
      <Content>
        <FloorPlanViewer floorPlaces={floorPlaces} quickPlaces={quickPlaces} reports={selectedPlaceReports} selectedPlaceId={selectedPlaceId} selectedPinId={selectedPinId} onPlaceChange={changePlace} onPinSelect={selectPin} />
        <ReportList reports={placeReports} selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
      </Content>
    </Page>
  )
}
