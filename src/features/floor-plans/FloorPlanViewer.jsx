import { useMemo } from 'react'
import styled from 'styled-components'
import PlaceDropdown from './PlaceDropdown.jsx'

const MapArea = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
`

const MapHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  h1 { margin: 0 auto 0 0; font-size: 24px; line-height: 1.4; }

  @media (max-width: 720px) { flex-wrap: wrap; h1 { width: 100%; } }
`

const Chip = styled.button`
  box-sizing: border-box;
  flex: 0 0 auto;
  height: 38px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 0;
  background: #f4eef1;
  color: #474446;
  font: inherit;
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;

  &[aria-pressed='true'] { background: #f7b6d4; color: #a3165f; }
  &:focus-visible { outline: 2px solid #b32e75; outline-offset: 3px; }
`

const PlanFrame = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: 28px;
  background: #fff;

  > img { display: block; width: 100%; height: 100%; object-fit: contain; }
  @media (max-width: 720px) { min-height: 440px; }
`

const Blueprint = styled.div`
  position: absolute;
  inset: 8% 4%;
  border: 2px solid #65666b;
  background: repeating-linear-gradient(0deg, transparent 0 68px, #65666b 69px 70px), repeating-linear-gradient(90deg, transparent 0 112px, #65666b 113px 114px);

  &::before { position: absolute; top: 36%; left: 20%; width: 54%; height: 28%; border: 2px solid #65666b; content: ''; }

  span {
    position: absolute;
    top: 51%;
    left: 38%;
    color: #474b57;
    font-size: clamp(22px, 3vw, 34px);
    font-weight: 700;
  }
`

const Pin = styled.button`
  position: absolute;
  z-index: 1;
  display: grid;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  place-items: center;
  border: 3px solid #fff;
  border-radius: 50%;
  background: ${({ $level }) => $level === 'high' ? '#fa44a8' : $level === 'mid' ? '#f57ab7' : '#f7b6d4'};
  color: ${({ $level }) => $level === 'low' ? '#a3165f' : '#fff'};
  font-size: ${({ $size }) => $size < 40 ? 13 : 15}px;
  font-weight: 700;
  cursor: pointer;

  ${({ $level }) => $level === 'high' && 'box-shadow: 0 0 0 8px rgba(250, 68, 168, .16);'}
  &:focus-visible { outline: 2px solid #b32e75; outline-offset: 3px; }
`

const Legend = styled.p`
  margin: 16px 0 0;
  color: #615c5f;
  font-size: 13px;
  span { margin-right: 14px; color: #474446; }
`

function pinSize(level) {
  return level === 'high' ? 48 : level === 'mid' ? 40 : 32
}

function isUnresolved(report) {
  const status = typeof report.status === 'string' ? report.status : report.status?.tone
  return ['UNRESOLVED', 'IN_PROGRESS', 'received', 'inProgress'].includes(status)
}

function toPercent(value) {
  const coordinate = Number(value)
  if (!Number.isFinite(coordinate)) return null
  return coordinate >= 0 && coordinate <= 1 ? coordinate * 100 : coordinate
}

function pinLevel(count) {
  return count >= 5 ? 'high' : count >= 3 ? 'mid' : 'low'
}

export default function FloorPlanViewer({ floorPlaces, quickPlaces, reports, selectedPlaceId, selectedPinId, onPlaceChange, onPinSelect }) {
  const places = [...floorPlaces, ...quickPlaces]
  const selectedPlace = places.find((place) => place.id === selectedPlaceId) ?? places[0]
  const pins = useMemo(() => {
    const groupedReports = new Map()

    reports
      .filter(isUnresolved)
      .forEach((report) => {
        const x = toPercent(report.pos_x)
        const y = toPercent(report.pos_y)
        if (x === null || y === null) return

        const id = `${x.toFixed(4)}:${y.toFixed(4)}`
        const group = groupedReports.get(id) ?? { id, x, y, count: 0 }
        groupedReports.set(id, { ...group, count: group.count + 1 })
      })

    return [...groupedReports.values()]
  }, [reports])

  return (
    <MapArea>
      <MapHeader>
        <h1>교내 지도 ✦</h1>
        <PlaceDropdown places={floorPlaces} selectedPlaceId={selectedPlaceId} onSelect={onPlaceChange} />
        {quickPlaces.map((place) => <Chip key={place.id} type="button" aria-pressed={place.id === selectedPlaceId} onClick={() => onPlaceChange(place.id)}>{place.name}</Chip>)}
      </MapHeader>
      <PlanFrame aria-label={`${selectedPlace?.name ?? '선택한 장소'} 평면도`} onClick={() => onPinSelect?.(null)}>
        {selectedPlace?.image_url ? <img src={selectedPlace.image_url} alt={`${selectedPlace.name} 평면도`} /> : <Blueprint aria-hidden="true"><span>{selectedPlace?.name} 평면도</span></Blueprint>}
        {pins.map((pin) => {
          const level = pinLevel(pin.count)
          return <Pin key={pin.id} type="button" aria-label={`미해결 신고 ${pin.count}건`} aria-pressed={selectedPinId === pin.id} $level={level} $size={pinSize(level)} style={{ left: `${pin.x}%`, top: `${pin.y}%` }} onClick={(event) => { event.stopPropagation(); onPinSelect?.(pin.id) }}>{pin.count}</Pin>
        })}
      </PlanFrame>
      <Legend><span>● 1–2건</span><span>● 3–4건</span><span>● 5건 이상</span>핀 숫자 = 장소별 미해결 신고 수</Legend>
    </MapArea>
  )
}
