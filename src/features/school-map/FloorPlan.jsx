import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import PlaceDropdown from './PlaceDropdown.jsx'
import CreativeFloorPlan from './CreativeFloorPlan.jsx'
import { getPreviewFloorPlan } from './floorPlanRooms.js'
import { buildingFloorPattern } from './schoolMapPreviewData.js'

const MapArea = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: ${({ $hasFloorPlan }) => $hasFloorPlan ? '10px' : '0'};
`

const MapHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  h1 { margin: 0 auto 0 0; font-size: ${({ theme }) => theme.schoolMap.font.heading}; font-weight: ${({ theme }) => theme.schoolMap.font.headingWeight}; line-height: 1.4; }

  @media (max-width: 720px) { flex-wrap: wrap; h1 { width: 100%; } }
`

const Chip = styled.button`
  box-sizing: border-box;
  flex: 0 0 auto;
  padding: ${({ theme }) => theme.reportForm.layout.chipPaddingBlock} ${({ theme }) => theme.reportForm.layout.chipPaddingInline};
  border-radius: 999px;
  border: 0;
  background: ${({ theme }) => theme.schoolMap.color.chip};
  color: ${({ theme }) => theme.schoolMap.color.secondaryText};
  font: inherit;
  font-size: ${({ theme }) => theme.schoolMap.font.label};
  font-weight: ${({ theme }) => theme.schoolMap.font.labelWeight};
  line-height: ${({ theme }) => theme.auth.font.lineHeight};
  white-space: nowrap;
  cursor: pointer;

  &[aria-pressed='true'] { background: ${({ theme }) => theme.schoolMap.color.selected}; color: ${({ theme }) => theme.schoolMap.color.accentText}; }
  &:disabled { opacity: 0.5; cursor: default; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.schoolMap.color.focus}; outline-offset: 3px; }
`

const PlanViewport = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
`

const PlanFrame = styled.div`
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: auto;
  scrollbar-gutter: ${({ $hasFloorPlan }) => $hasFloorPlan ? 'stable' : 'auto'};
  background: ${({ theme }) => theme.schoolMap.color.surface};

  @media (max-width: 980px) {
    min-height: ${({ $hasFloorPlan }) => $hasFloorPlan ? 'max(264px, calc(100dvh - 216px))' : '280px'};
  }
`

const EmptyPlan = styled.div`
  display: grid;
  height: 100%;
  place-items: center;
  color: ${({ theme }) => theme.schoolMap.color.mutedText};
`

const ZoomControls = styled.div`
  position: absolute;
  z-index: 1;
  inset-inline-end: 20px;
  inset-block-end: 20px;
  display: flex;
  gap: 4px;
`

const Legend = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin: 8px 0 0;
  color: ${({ theme }) => theme.schoolMap.color.mutedText};
  font-size: ${({ theme }) => theme.schoolMap.font.caption};
`

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.schoolMap.color.secondaryText};

  &::before {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme, $level }) => theme.schoolMap.color.reportCount[$level]};
    content: '';
  }
`

const zoomStep = 25
const minZoom = zoomStep
const maxZoom = 200

function clampZoom(value) {
  return Math.min(maxZoom, Math.max(minZoom, value))
}

export default function FloorPlan({ floorPlaces, quickPlaces, selectedPlaceId, selectedRoom, roomCounts, onPlaceChange, onRoomSelect, usePreview, floorResult }) {
  const [zoom, setZoom] = useState(100)
  const frameRef = useRef(null)
  const places = [...floorPlaces, ...quickPlaces]
  const selectedPlace = places.find((place) => place.id === selectedPlaceId) ?? places[0]
  const [, building, floor] = buildingFloorPattern.exec(selectedPlace?.name ?? '') ?? []
  const data = usePreview ? getPreviewFloorPlan(selectedPlaceId, building, floor) : floorResult?.data
  const validPlan = Number.isInteger(data?.gridCols) && data.gridCols > 0 &&
    Number.isInteger(data.gridRows) && data.gridRows > 0 && Array.isArray(data.rooms) &&
    data.rooms.every((room) => room?.id != null && typeof room.name === 'string' && Array.isArray(room.cells))
  const hasFloorPlan = validPlan
  const title = building === '창의관' ? `${floor}층` : selectedPlace?.name
  const expectsPlan = !usePreview && (building || (selectedPlace?.gridRows != null && selectedPlace?.gridCols != null))
  let emptyMessage = '표시할 평면도가 없습니다.'
  if (expectsPlan && !floorResult) emptyMessage = '평면도를 불러오는 중입니다.'
  if (expectsPlan && floorResult && (!data || (data.gridRows != null && data.gridCols != null && !validPlan))) {
    emptyMessage = '평면도를 불러오지 못했습니다.'
  }

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || !hasFloorPlan) return

    function zoomWithWheel(event) {
      if (event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return

      event.preventDefault()
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? frame.clientHeight : 1
      const factor = Math.exp(-event.deltaY * unit * 0.0015)
      setZoom((value) => clampZoom(value * factor))
    }

    frame.addEventListener('wheel', zoomWithWheel, { passive: false })
    return () => frame.removeEventListener('wheel', zoomWithWheel)
  }, [hasFloorPlan])

  const zoomLabel = Math.round(zoom)

  return (
    <MapArea $hasFloorPlan={hasFloorPlan}>
      <MapHeader>
        <h1>교내 지도 ✦</h1>
        {floorPlaces.length > 0 && <PlaceDropdown places={floorPlaces} selectedPlaceId={selectedPlaceId} onSelect={onPlaceChange} />}
        {quickPlaces.map((place) => <Chip key={place.id} type="button" aria-pressed={place.id === selectedPlaceId} onClick={() => onPlaceChange(place.id)}>{place.name}</Chip>)}
      </MapHeader>
      <PlanViewport ref={frameRef}>
        <PlanFrame $hasFloorPlan={hasFloorPlan} aria-label={`${selectedPlace?.name ?? '선택한 장소'} 평면도`}>
          {hasFloorPlan ? (
            <CreativeFloorPlan
              title={title}
              grid={data}
              splitSupportRoom={building === '창의관' && floor === '1'}
              zoom={zoom}
              roomCounts={roomCounts}
              selectedRoom={selectedRoom}
              onRoomSelect={onRoomSelect}
            />
          ) : <EmptyPlan role="status">{emptyMessage}</EmptyPlan>}
        </PlanFrame>
        {hasFloorPlan && (
          <ZoomControls role="group" aria-label="평면도 확대 및 축소">
            <Chip type="button" aria-label="축소" disabled={zoom === minZoom} onClick={() => setZoom((value) => clampZoom((Math.ceil(Math.round(value) / zoomStep) - 1) * zoomStep))}>−</Chip>
            <Chip type="button" aria-label={`현재 ${zoomLabel}%, 기본 크기로 되돌리기`} onClick={() => setZoom(100)}>{zoomLabel}%</Chip>
            <Chip type="button" aria-label="확대" disabled={zoom === maxZoom} onClick={() => setZoom((value) => clampZoom((Math.floor(Math.round(value) / zoomStep) + 1) * zoomStep))}>+</Chip>
          </ZoomControls>
        )}
      </PlanViewport>
      {hasFloorPlan && <Legend><LegendItem $level="low">1–2건</LegendItem><LegendItem $level="mid">3–4건</LegendItem><LegendItem $level="high">5건 이상</LegendItem></Legend>}
    </MapArea>
  )
}
