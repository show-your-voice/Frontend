import styled from 'styled-components'

const Canvas = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: clamp(20px, 4vw, 48px);
  background: #fff;
  color: #2e3238;
  font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
`

const Wing = styled.div`
  display: grid;
  grid-template-columns: ${({ $columns }) => `repeat(${$columns}, minmax(0, 1fr))`};
  align-self: ${({ $align }) => $align};
  width: ${({ $width }) => $width};
  min-height: clamp(76px, 15vw, 150px);
  border-top: 2px solid #363b42;
  border-left: 2px solid #363b42;
`

const Room = styled.div`
  display: grid;
  min-width: 0;
  padding: 6px;
  place-items: center;
  border-right: 2px solid #363b42;
  border-bottom: 2px solid #363b42;
  font-size: clamp(10px, 1.3vw, 18px);
  font-weight: 500;
  line-height: 1.35;
  text-align: center;
  word-break: keep-all;
`

const Middle = styled.div`
  display: grid;
  place-items: center;
  min-height: 0;
`

const Title = styled.h2`
  margin: 0;
  color: #343b46;
  font-size: clamp(26px, 4vw, 56px);
  font-weight: 600;
  letter-spacing: .08em;
`

function RoomRow({ rooms, width, align }) {
  return (
    <Wing $columns={rooms.length} $width={width} $align={align}>
      {rooms.map((room) => <Room key={room}>{room}</Room>)}
    </Wing>
  )
}

export default function CreativeFloorPlan({ floor, topRooms, bottomRooms, topWidth = '86%', bottomWidth = '86%', topAlign = 'start', bottomAlign = 'end' }) {
  return (
    <Canvas aria-label={`창의관 ${floor}층 평면도`}>
      <RoomRow rooms={topRooms} width={topWidth} align={topAlign} />
      <Middle><Title>{floor}층 평면도</Title></Middle>
      <RoomRow rooms={bottomRooms} width={bottomWidth} align={bottomAlign} />
    </Canvas>
  )
}
