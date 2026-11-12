import styled from 'styled-components'

const Canvas = styled.section`
  --room-gap: 4px;
  --room-columns: ${({ $count }) => Math.max(18, $count)};
  --plan-columns: ${({ $count }) => $count};
  display: grid;
  grid-template-columns: calc(100% * var(--plan-columns) / var(--room-columns));
  grid-template-rows: max-content 1fr;
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
  width: 100%;
  height: 100%;
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

export default function CreativeFloorPlan({ title, grid, splitSupportRoom, zoom, roomCounts, selectedRoom, onRoomSelect }) {
  return (
    <Canvas $count={grid.gridCols} $zoom={zoom} aria-label={`${title} 평면도`}>
      <Title>{title}</Title>
      <CoordinateGrid $rows={grid.gridRows}>
        {grid.rooms.flatMap(({ id, name, cells }) => {
          const regions = getRoomRegions(cells, grid.gridRows, grid.gridCols)
          const passage = ['복도', '로비'].includes(name.trim())
          const labels = splitSupportRoom && name === '교육환경지원실' && cells.length === 1
            ? ['청소실무원 휴게실', '재료실', name]
            : null
          const count = roomCounts.get(id) ?? 0

          return regions.map((style, index) => (
            <Room
              key={`${id}:${style.gridArea}`}
              data-area-id={id}
              $grouped={Boolean(labels)}
              $passage={passage}
              style={style}
              type="button"
              title={name}
              aria-label={name}
              tabIndex={index === 0 ? undefined : -1}
              aria-pressed={selectedRoom === id}
              onClick={() => onRoomSelect(id)}
            >
              {index === 0 && (labels ? <RoomGroup>{labels.map((label) => <span key={label}>{label}</span>)}</RoomGroup> : name)}
              {index === 0 && count > 0 && <Count $count={count} aria-label={`미해결 신고 ${count}건`}>{count}</Count>}
            </Room>
          ))
        })}
      </CoordinateGrid>
    </Canvas>
  )
}
