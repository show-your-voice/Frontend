import styled from 'styled-components'
import PlaceDropdown from './PlaceDropdown.jsx'
import CreativeFloorPlan from './CreativeFloorPlan.jsx'
import { floorPlanRooms } from './floorPlanRooms.js'
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
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.schoolMap.color.focus}; outline-offset: 3px; }
`

const PlanFrame = styled.div`
  position: relative;
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

export default function FloorPlan({ floorPlaces, quickPlaces, selectedPlaceId, selectedRoom, roomCounts, onPlaceChange, onRoomSelect }) {
  const places = [...floorPlaces, ...quickPlaces]
  const selectedPlace = places.find((place) => place.id === selectedPlaceId) ?? places[0]
  const [, building, floor] = buildingFloorPattern.exec(selectedPlace?.name ?? '') ?? []
  const rows = floorPlanRooms[building]?.[floor]
  const hasFloorPlan = Boolean(rows)
  const title = building === '창의관' ? `${floor}층` : `${building} ${floor}층`
  const columns = building === '창의관' ? 13 : 18

  return (
    <MapArea $hasFloorPlan={hasFloorPlan}>
      <MapHeader>
        <h1>교내 지도 ✦</h1>
        {floorPlaces.length > 0 && <PlaceDropdown places={floorPlaces} selectedPlaceId={selectedPlaceId} onSelect={onPlaceChange} />}
        {quickPlaces.map((place) => <Chip key={place.id} type="button" aria-pressed={place.id === selectedPlaceId} onClick={() => onPlaceChange(place.id)}>{place.name}</Chip>)}
      </MapHeader>
      <PlanFrame $hasFloorPlan={hasFloorPlan} aria-label={`${selectedPlace?.name ?? '선택한 장소'} 평면도`}>
        {rows ? (
          <CreativeFloorPlan
            placeId={selectedPlace.id}
            title={title}
            rows={rows}
            columns={columns}
            roomCounts={roomCounts}
            selectedRoom={selectedRoom}
            onRoomSelect={onRoomSelect}
          />
        ) : <EmptyPlan>표시할 평면도가 없습니다.</EmptyPlan>}
      </PlanFrame>
      {hasFloorPlan && <Legend><LegendItem $level="low">1–2건</LegendItem><LegendItem $level="mid">3–4건</LegendItem><LegendItem $level="high">5건 이상</LegendItem></Legend>}
    </MapArea>
  )
}
