import styled from 'styled-components'
import { getRoomAreaId } from './schoolMapPreviewData.js'

const Canvas = styled.section`
  --passage-background: ${({ theme }) => theme.schoolMap.color.passage};
  --room-gap: 4px;
  --room-columns: ${({ $count }) => Math.max(18, $count)};
  --plan-columns: ${({ $count }) => $count};
  display: grid;
  grid-template-columns: ${({ $grid }) => $grid
    ? 'calc(100% * var(--plan-columns) / var(--room-columns))'
    : 'calc((100% + var(--room-gap)) * var(--plan-columns) / var(--room-columns) - var(--room-gap))'};
  grid-template-rows: ${({ $grid }) => $grid ? 'max-content 1fr' : 'max-content auto max-content auto'};
  justify-content: center;
  gap: var(--room-gap);
  box-sizing: border-box;
  width: ${({ $zoom }) => $zoom}%;
  margin-inline: auto;
  container-type: inline-size;
  min-height: 100%;
  padding: clamp(6px, 1vw, 12px);
  background: ${({ theme }) => theme.schoolMap.color.surface};
  color: ${({ theme }) => theme.schoolMap.color.accentText};
`

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.schoolMap.color.accentText};
  font-size: ${({ theme }) => theme.schoolMap.font.floorTitle};
  font-weight: ${({ theme }) => theme.schoolMap.font.headingWeight};
  text-align: center;
`

const RoomRow = styled.div`
  --room-size: calc((100% - (var(--plan-columns) - 1) * var(--room-gap)) / var(--plan-columns));
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, var(--room-size));
  justify-content: start;
  align-items: start;
  align-content: start;
  gap: var(--room-gap);
`

const RoomSection = styled.div`
  display: grid;
  align-content: ${({ $upper }) => $upper ? 'end' : 'start'};
  gap: var(--room-gap);
`

const CoordinateGrid = styled.div`
  display: grid;
  align-self: center;
  grid-template-columns: repeat(var(--plan-columns), minmax(0, 1fr));
  grid-template-rows: repeat(${({ $rows }) => $rows}, calc(100cqw / var(--room-columns)));
`

const RoomGroup = styled.span`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  font-size: clamp(5px, 1.2cqw, 10px);

  > span { display: grid; place-items: center; padding-inline: 2px; }
  > :first-child { box-shadow: inset -1px 0 ${({ theme }) => theme.schoolMap.color.accent}; font-size: 0.8em; }
  > :last-child { grid-column: 1 / -1; box-shadow: inset 0 1px ${({ theme }) => theme.schoolMap.color.accent}; }
`

const Room = styled.button`
  position: relative;
  display: grid;
  box-sizing: border-box;
  grid-column: ${({ $elevator }) => $elevator ? '-2 / -1' : 'auto'};
  width: 100%;
  aspect-ratio: ${({ $placed }) => $placed ? 'auto' : '1'};
  height: ${({ $placed }) => $placed ? '100%' : 'auto'};
  min-width: 0;
  min-height: 0;
  padding: ${({ $grouped }) => $grouped ? '0' : 'clamp(0px, 0.3cqw, 3px)'};
  overflow: hidden;
  place-items: center;
  border: ${({ $passage }) => $passage ? '0' : '2px solid'} ${({ theme, $passage }) => $passage ? '' : theme.schoolMap.color.accent};
  border-radius: 0;
  background: ${({ theme, $passage }) => $passage ? theme.schoolMap.color.passage : theme.schoolMap.color.surface};
  color: inherit;
  font: inherit;
  font-size: clamp(6px, 1.6cqw, ${({ theme }) => theme.schoolMap.font.caption});
  font-weight: ${({ theme }) => theme.schoolMap.font.labelWeight};
  line-height: 1.15;
  text-align: center;
  overflow-wrap: anywhere;
  cursor: pointer;

  &:hover { background: ${({ theme }) => theme.schoolMap.color.passage}; }
  &[aria-pressed='true'] { background: ${({ theme }) => theme.schoolMap.color.selected}; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.schoolMap.color.focus}; outline-offset: 1px; }
`

const Count = styled.span`
  position: absolute;
  top: 2px;
  right: 3px;
  min-width: 16px;
  padding: 0 3px;
  border-radius: 999px;
  background: ${({ theme, $count }) => theme.schoolMap.color.reportCount[$count >= 5 ? 'high' : $count >= 3 ? 'mid' : 'low']};
  color: ${({ theme }) => theme.schoolMap.color.text};
  font-size: 11px;
`

const Lobby = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  aspect-ratio: 1;
  place-items: center;
  background: var(--passage-background);
  color: ${({ theme }) => theme.schoolMap.color.accentText};
  font-size: clamp(6px, 1.6cqw, ${({ theme }) => theme.schoolMap.font.caption});

  &::before {
    position: absolute;
    inset: calc(-1 * var(--room-gap)) 0 auto;
    height: var(--room-gap);
    background: inherit;
    content: '';
  }
`

const Corridor = styled.div`
  grid-column: 1 / -2;
  align-self: stretch;
  display: grid;
  place-items: center;
  background: var(--passage-background);
  color: ${({ theme }) => theme.schoolMap.color.accentText};
  font-size: ${({ theme }) => theme.schoolMap.font.caption};
`

function getRoomRegions(cells, gridRows, gridCols) {
  const valid = cells.filter((cell) => Number.isInteger(cell?.gridRow) && cell.gridRow >= 0 && cell.gridRow < gridRows &&
    Number.isInteger(cell.gridCol) && cell.gridCol >= 0 && cell.gridCol < gridCols)
  const occupied = new Map(valid.map((cell) => [`${cell.gridRow}:${cell.gridCol}`, cell]))
  const positions = [...occupied.values()]
  if (positions.length === 0) return []

  const top = Math.min(...positions.map((cell) => cell.gridRow))
  const left = Math.min(...positions.map((cell) => cell.gridCol))
  const height = Math.max(...positions.map((cell) => cell.gridRow)) - top + 1
  const width = Math.max(...positions.map((cell) => cell.gridCol)) - left + 1
  if (positions.length === height * width) {
    return [{ gridArea: `${top + 1} / ${left + 1} / span ${height} / span ${width}` }]
  }

  return positions.map(({ gridRow, gridCol }) => ({
    gridArea: `${gridRow + 1} / ${gridCol + 1}`,
    borderTopWidth: occupied.has(`${gridRow - 1}:${gridCol}`) ? 0 : undefined,
    borderRightWidth: occupied.has(`${gridRow}:${gridCol + 1}`) ? 0 : undefined,
    borderBottomWidth: occupied.has(`${gridRow + 1}:${gridCol}`) ? 0 : undefined,
    borderLeftWidth: occupied.has(`${gridRow}:${gridCol - 1}`) ? 0 : undefined,
  }))
}

export default function CreativeFloorPlan({ placeId, title, rows, grid, columns, splitSupportRoom, zoom, roomCounts, selectedRoom, onRoomSelect }) {
  const split = rows ? Math.ceil(rows.length / 2) : 0

  function renderRoom(name, { rooms, elevator = false, roomId, style, primary = true, passage = false } = {}) {
    const roomKeys = roomId == null ? (rooms ?? [name]) : [roomId]
    const count = roomKeys.reduce((total, key) => total + (roomCounts.get(key) ?? 0), 0)
    const areaId = roomId ?? getRoomAreaId(placeId, name)

    return (
      <Room key={style ? `${areaId}:${style.gridArea}` : areaId} data-area-id={areaId} $elevator={elevator} $grouped={Boolean(rooms)} $placed={Boolean(style)} $passage={passage} style={style} type="button" title={name} aria-label={name} tabIndex={primary ? undefined : -1} aria-pressed={selectedRoom === areaId} onClick={() => onRoomSelect(areaId, roomKeys)}>
        {primary && (rooms ? <RoomGroup>{rooms.map((room) => <span key={room}>{room}</span>)}</RoomGroup> : name)}
        {primary && count > 0 && <Count $count={count} aria-label={`미해결 신고 ${count}건`}>{count}</Count>}
      </Room>
    )
  }

  function renderRow(rooms, index) {
    return (
      <RoomRow key={index} $count={columns}>
        {rooms.map((room) => {
          const name = typeof room === 'string' ? room : room.name
          if (name === '로비') return <Lobby key={room.id ?? name}>{name}</Lobby>
          return renderRoom(name, { rooms: room.rooms })
        })}
      </RoomRow>
    )
  }

  if (grid) {
    return (
      <Canvas $count={columns} $grid $zoom={zoom} aria-label={`${title} 평면도`}>
        <Title>{title}</Title>
        <CoordinateGrid $rows={grid.gridRows}>
          {grid.rooms.flatMap(({ id, name, cells }) => {
            const regions = getRoomRegions(cells, grid.gridRows, grid.gridCols)
            const passage = ['복도', '로비'].includes(name.trim())
            const rooms = splitSupportRoom && name === '교육환경지원실' && cells.length === 1
              ? ['청소실무원 휴게실', '재료실', name]
              : undefined

            return regions.map((style, index) => renderRoom(name, {
              roomId: id, style, primary: index === 0, rooms, passage,
            }))
          })}
        </CoordinateGrid>
      </Canvas>
    )
  }

  return (
    <Canvas $count={columns} $zoom={zoom} aria-label={`${title} 평면도`}>
      <Title>{title}</Title>
      <RoomSection $upper>{rows.slice(0, split).map(renderRow)}</RoomSection>
      <RoomRow $count={columns}>
        <Corridor>복도</Corridor>
        {renderRoom('승강기', { elevator: true })}
      </RoomRow>
      <RoomSection>{rows.slice(split).map(renderRow)}</RoomSection>
    </Canvas>
  )
}
