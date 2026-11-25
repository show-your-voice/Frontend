import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import sparkle from '../../assets/auth/sparkle.svg'
import PlaceDropdown from './PlaceDropdown.jsx'
import CreativeFloorPlan from './CreativeFloorPlan.jsx'
import { getPreviewFloorPlan } from './floorPlanRooms.js'
import { buildingFloorPattern } from './schoolMapPreviewData.js'

const MapArea = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: ${({ $hasFloorPlan, $management }) => $hasFloorPlan && !$management ? '10px' : '0'};
`

const MapHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  h1 { margin: 0 auto 0 0; font-size: ${({ theme }) => theme.schoolMap.font.heading}; font-weight: ${({ theme }) => theme.schoolMap.font.headingWeight}; line-height: 1.4; }
  h1 img { display: inline-block; width: 19.2px; height: 19.2px; margin-left: 8px; vertical-align: middle; }

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
  min-height: ${({ $management }) => $management ? '300px' : '0'};
`

const PlanFrame = styled.div`
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: auto;
  scrollbar-gutter: ${({ $hasFloorPlan }) => $hasFloorPlan ? 'stable' : 'auto'};
  background: ${({ theme }) => theme.schoolMap.color.surface};
  ${({ $management }) => $management && `
    border-radius: 28px;
  `}

  @media (max-width: 980px) {
    min-height: ${({ $hasFloorPlan, $management }) => $hasFloorPlan && !$management ? 'max(264px, calc(100dvh - 216px))' : '280px'};
  }
`

const EmptyPlan = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  gap: 8px;
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

export default function FloorPlan({
  floorPlaces, quickPlaces, selectedPlaceId, selectedRoom, roomCounts, onPlaceChange, onRoomSelect, onPinSelect,
  usePreview, floorResult, placesLoading, placesError, onRetryPlaces, onRetryFloor, roomIdsByName, roomCountsByName,
  management, renderRoomEditor, mapActions,
}) {
  const frameRef = useRef(null)
  const places = [...floorPlaces, ...quickPlaces]
  const selectedPlace = places.find((place) => place.id === selectedPlaceId) ?? places[0]
  const [, building, floor] = buildingFloorPattern.exec(selectedPlace?.name ?? '') ?? []
  const isFloor = Boolean(building || (selectedPlace?.gridRows != null && selectedPlace?.gridCols != null))
  const defaultZoom = 100
  const [zoomBuilding, setZoomBuilding] = useState(building)
  const [zoom, setZoom] = useState(defaultZoom)
  if (zoomBuilding !== building) {
    setZoomBuilding(building)
    setZoom(defaultZoom)
  }
  const liveData = floorResult?.data
  const livePlanValid = Number.isInteger(liveData?.gridCols) && liveData.gridCols > 0 &&
    Number.isInteger(liveData?.gridRows) && liveData.gridRows > 0 && Array.isArray(liveData.rooms) &&
    liveData.rooms.every((room) => room?.id != null && typeof room.name === 'string' && Array.isArray(room.cells))
  const fallback = !management && !usePreview && floorResult && (floorResult.error || liveData == null || (isFloor && !livePlanValid))
  const data = usePreview || fallback ? getPreviewFloorPlan(selectedPlaceId, building, floor) : floorResult?.data
  const validPlan = Number.isInteger(data?.gridCols) && data.gridCols > 0 &&
    Number.isInteger(data.gridRows) && data.gridRows > 0 && Array.isArray(data.rooms) &&
    data.rooms.every((room) => room?.id != null && typeof room.name === 'string' && Array.isArray(room.cells))
  const hasFloorPlan = validPlan
  const title = building === '창의관' ? `${floor}층` : selectedPlace?.name
  const expectsPlan = !usePreview && (isFloor || (management && selectedPlace))
  const noGrid = data?.gridRows === null && data?.gridCols === null
  let emptyMessage = selectedPlace ? '표시할 평면도가 없습니다.' : '조회할 장소가 없습니다.'
  let retry
  if (placesLoading) {
    emptyMessage = '장소 목록을 불러오는 중입니다.'
  } else if (placesError) {
    emptyMessage = placesError
    retry = onRetryPlaces
  } else if (expectsPlan && !floorResult) {
    emptyMessage = '평면도를 불러오는 중입니다.'
  } else if (expectsPlan && !validPlan && !noGrid) {
    emptyMessage = floorResult?.error ?? '평면도를 불러오지 못했습니다.'
    retry = onRetryFloor
  }

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || !hasFloorPlan || management) return

    function zoomWithWheel(event) {
      if (event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return

      event.preventDefault()
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? frame.clientHeight : 1
      const factor = Math.exp(-event.deltaY * unit * 0.0015)
      setZoom((value) => clampZoom(value * factor))
    }

    frame.addEventListener('wheel', zoomWithWheel, { passive: false })
    return () => frame.removeEventListener('wheel', zoomWithWheel)
  }, [hasFloorPlan, management])

  const zoomLabel = Math.round(zoom)
  const zoomOut = () => setZoom((value) => clampZoom((Math.ceil(Math.round(value) / zoomStep) - 1) * zoomStep))
  const zoomIn = () => setZoom((value) => clampZoom((Math.floor(Math.round(value) / zoomStep) + 1) * zoomStep))

  return (
    <MapArea $hasFloorPlan={hasFloorPlan} $management={management}>
      <MapHeader>
        <h1>{management ? <>교내 지도 커스텀<img src={sparkle} alt="" /></> : '교내 지도 ✦'}</h1>
        {floorPlaces.length > 0 && <PlaceDropdown places={floorPlaces} selectedPlaceId={selectedPlaceId} onSelect={onPlaceChange} />}
        {quickPlaces.map((place) => <Chip key={place.id} type="button" aria-pressed={place.id === selectedPlaceId} onClick={() => onPlaceChange(place.id)}>{place.name}</Chip>)}
      </MapHeader>
      <PlanViewport ref={frameRef} $management={management}>
        {mapActions}
        <PlanFrame $hasFloorPlan={hasFloorPlan} $management={management} aria-label={`${selectedPlace?.name ?? '선택한 장소'} 평면도`}>
          {hasFloorPlan ? (
            <CreativeFloorPlan
              title={title}
              grid={data}
              splitSupportRoom={building === '창의관' && floor === '1'}
              zoom={zoom}
              roomCounts={fallback ? new Map(data.rooms.map((room) => [room.id, roomCountsByName.get(room.name) ?? 0])) : roomCounts}
              selectedRoom={fallback ? null : selectedRoom}
              onRoomSelect={fallback ? (_, name) => onRoomSelect(roomIdsByName.get(name), name) : onRoomSelect}
              onPinSelect={onPinSelect}
              roomIdsByName={fallback ? roomIdsByName : undefined}
              renderRoomEditor={renderRoomEditor}
              enlarge={management && building === '창의관'}
            />
          ) : (
            <EmptyPlan>
              <span role="status">{emptyMessage}</span>
              {retry && <Chip type="button" onClick={retry}>다시 시도</Chip>}
            </EmptyPlan>
          )}
        </PlanFrame>
        {hasFloorPlan && !management && (
          <ZoomControls role="group" aria-label="평면도 확대 및 축소">
            <Chip type="button" aria-label="축소" disabled={zoom === minZoom} onClick={zoomOut}>−</Chip>
            <Chip type="button" aria-label={`현재 ${zoomLabel}%, 기본 크기로 되돌리기`} onClick={() => setZoom(defaultZoom)}>{zoomLabel}%</Chip>
            <Chip type="button" aria-label="확대" disabled={zoom === maxZoom} onClick={zoomIn}>+</Chip>
          </ZoomControls>
        )}
      </PlanViewport>
      {hasFloorPlan && !management && <Legend><LegendItem $level="low">1–2건</LegendItem><LegendItem $level="mid">3–4건</LegendItem><LegendItem $level="high">5건 이상</LegendItem></Legend>}
    </MapArea>
  )
}
