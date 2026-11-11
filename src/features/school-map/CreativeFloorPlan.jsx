import styled from 'styled-components'
import { getRoomAreaId } from './schoolMapPreviewData.js'

const Canvas = styled.section`
  --passage-background: ${({ theme }) => theme.schoolMap.color.passage};
  --room-gap: 4px;
  --room-columns: ${({ $columns }) => $columns};
  display: grid;
  grid-template-rows: max-content auto max-content auto;
  gap: var(--room-gap);
  box-sizing: border-box;
  width: 100%;
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
  display: grid;
  grid-template-columns: repeat(var(--room-columns), minmax(0, 1fr));
  align-items: start;
  align-content: start;
  gap: var(--room-gap);
`

const UpperRoomRow = styled(RoomRow)`
  align-content: end;
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
  aspect-ratio: 1;
  min-width: 0;
  min-height: 0;
  padding: ${({ $grouped }) => $grouped ? '0' : 'clamp(0px, 0.3cqw, 3px)'};
  overflow: hidden;
  place-items: center;
  border: 2px solid ${({ theme }) => theme.schoolMap.color.accent};
  border-radius: 0;
  background: ${({ theme }) => theme.schoolMap.color.surface};
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

export default function CreativeFloorPlan({ placeId, title, rows, columns, roomCounts, selectedRoom, onRoomSelect }) {
  function renderRoom(name, rooms, elevator = false) {
    const roomNames = rooms ?? [name]
    const count = roomNames.reduce((total, roomName) => total + (roomCounts.get(roomName) ?? 0), 0)
    const areaId = getRoomAreaId(placeId, name)

    return (
      <Room key={areaId} data-area-id={areaId} $elevator={elevator} $grouped={Boolean(rooms)} type="button" title={name} aria-label={rooms ? name : undefined} aria-pressed={selectedRoom === areaId} onClick={() => onRoomSelect(areaId, roomNames)}>
        {rooms ? <RoomGroup>{rooms.map((room) => <span key={room}>{room}</span>)}</RoomGroup> : name}
        {count > 0 && <Count $count={count} aria-label={`미해결 신고 ${count}건`}>{count}</Count>}
      </Room>
    )
  }

  function renderRow(rooms) {
    return rooms.map((room) => {
      if (room === '로비') return <Lobby key={room}>{room}</Lobby>
      if (typeof room === 'string') return renderRoom(room)
      return renderRoom(room.name, room.rooms)
    })
  }

  return (
    <Canvas $columns={columns} aria-label={`${title} 평면도`}>
      <Title>{title}</Title>
      <UpperRoomRow>{renderRow(rows[0])}</UpperRoomRow>
      <RoomRow>
        <Corridor>복도</Corridor>
        {renderRoom('승강기', undefined, true)}
      </RoomRow>
      <RoomRow>{renderRow(rows[1])}</RoomRow>
    </Canvas>
  )
}
