import styled from 'styled-components'
import heartSmall from '../../assets/auth/heart-small.svg'
import heart from '../../assets/auth/heart.svg'
import logo from '../../assets/auth/logo.svg'
import notebookLinesBack from '../../assets/auth/notebook-lines-back.svg'
import notebookLines from '../../assets/auth/notebook-lines.svg'
import pearlLineMiddle from '../../assets/auth/pearl-line-middle.svg'
import pearlLine from '../../assets/auth/pearl-line.svg'
import ring01 from '../../assets/auth/ring-01.svg'
import ring02 from '../../assets/auth/ring-02.svg'
import ring03 from '../../assets/auth/ring-03.svg'
import ring04 from '../../assets/auth/ring-04.svg'
import ring05 from '../../assets/auth/ring-05.svg'
import ring06 from '../../assets/auth/ring-06.svg'
import ring07 from '../../assets/auth/ring-07.svg'
import ring08 from '../../assets/auth/ring-08.svg'
import sparkleLarge from '../../assets/auth/sparkle-large.svg'
import sparkleMintSmall from '../../assets/auth/sparkle-mint-small.svg'
import sparkleMint from '../../assets/auth/sparkle-mint.svg'
import sparkle from '../../assets/auth/sparkle.svg'

// 시안의 패널 높이(924px)를 기준으로 좌표를 옮긴다. 1단위는 시안의 1px이며,
// 화면이 낮으면 패널 전체가 같은 비율로 줄어든다.
const DESIGN_HEIGHT = 924
const u = (value) => `calc(${value} * var(--u))`

// 시안의 스프링 고리 11개. 같은 모양이 반복되는 자리는 같은 에셋을 쓴다.
const rings = [ring01, ring02, ring03, ring03, ring04, ring05, ring05, ring06, ring07, ring06, ring08]

const pearlLines = [
  { src: pearlLine, x: 0, width: 202 },
  { src: pearlLineMiddle, x: 202, width: 201 },
  { src: pearlLine, x: 403, width: 202 },
]

const Frame = styled.div`
  height: min(${DESIGN_HEIGHT}px, calc(100dvh - ${({ theme }) => theme.auth.layout.pageGutter} * 2));
  aspect-ratio: 720 / ${DESIGN_HEIGHT};
  container-type: size;
`

// 장식 일러스트라 시안 좌표대로 절대 위치를 쓴다.
const Panel = styled.div`
  --u: calc(100cqh / ${DESIGN_HEIGHT});

  position: relative;
  left: ${u(9)};
  width: 100%;
  height: 100%;
  font-family: ${({ theme }) => theme.auth.font.family};

  img {
    position: absolute;
    max-width: none;
  }
`

const Page = styled.div`
  position: absolute;
  top: ${({ $top }) => u($top)};
  left: ${u(22)};
  width: ${u(686)};
  height: ${u(840)};
  overflow: hidden;
  border-radius: ${u(20)};
  background: ${({ theme, $back }) => $back ? theme.auth.color.notebookShadow : theme.auth.color.surface};
`

const Copy = styled.div`
  position: absolute;
  top: ${u(516)};
  left: ${u(80)};
`

const Title = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.auth.color.textPrimary};
  font-size: ${u(24)};
  font-weight: 700;
`

const Description = styled.p`
  margin: ${u(11.8)} 0 0;
  color: ${({ theme }) => theme.auth.color.textSecondary};
  font-size: ${u(16)};
  white-space: nowrap;
`

const Rings = styled.div`
  position: absolute;
  top: ${u(104)};
  left: ${u(672)};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${u(78)};
  height: ${u(703)};
`

const Ring = styled.div`
  position: relative;
  height: ${u(27)};

  img {
    bottom: 0;
    left: 0;
  }
`

function Decor({ src, x, y, width, height, alt = '', rotate }) {
  return (
    <img
      src={src}
      width={width}
      height={height}
      alt={alt}
      style={{
        top: u(y),
        left: u(x),
        width: u(width),
        height: u(height),
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    />
  )
}

function PearlLines({ x, y }) {
  return pearlLines.map((line) => (
    <Decor key={line.x} src={line.src} x={x + line.x} y={y} width={line.width} height={12} />
  ))
}

function NotebookPage({ top, back = false }) {
  return (
    <Page $top={top} $back={back}>
      <PearlLines x={22} y={27} />
      <Decor src={back ? notebookLinesBack : notebookLines} x={24} y={72} width={603.002} height={671} />
    </Page>
  )
}

export default function AuthBrandPanel() {
  return (
    <Frame>
      <Panel>
        <NotebookPage top={43} back />
        <NotebookPage top={30} />
        <Decor src={logo} x={104.16} y={243.16} width={487.68} height={213.12} alt="너목보" />
        <Copy>
          <Title>
            교내 불편함을 지도 위에서
            <br />
            바로 신고하고 확인하세요
          </Title>
          <Description>평면도에서 장소를 고르고, 로드뷰로 확인하고, 처리 상태까지 한 곳에서.</Description>
        </Copy>
        <Decor src={sparkleLarge} x={598} y={150} width={70.4} height={70.4} />
        <Decor src={sparkleMint} x={626} y={252} width={35.2} height={35.2} />
        <Decor src={sparkle} x={70} y={700} width={38.4} height={38.4} />
        <Decor src={heart} x={580.84} y={733.2} width={44.8} height={41.6} rotate={12} />
        <Decor src={heartSmall} x={92.04} y={177.37} width={28} height={26} rotate={-10} />
        <Decor src={sparkleMintSmall} x={150} y={126} width={25.6} height={25.6} />
        <PearlLines x={58} y={817} />
        <Rings aria-hidden="true">
          {rings.map((ring, index) => (
            <Ring key={index}>
              <img src={ring} width="78" height="30.39" alt="" style={{ width: u(78), height: u(30.39) }} />
            </Ring>
          ))}
        </Rings>
      </Panel>
    </Frame>
  )
}
