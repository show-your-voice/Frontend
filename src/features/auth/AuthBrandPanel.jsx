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

// 시안의 스프링 고리 11개. 같은 모양이 반복되는 자리는 같은 에셋을 쓴다.
const rings = [ring01, ring02, ring03, ring03, ring04, ring05, ring05, ring06, ring07, ring06, ring08]

const pearlLines = [
  { src: pearlLine, x: 0, width: 202 },
  { src: pearlLineMiddle, x: 202, width: 201 },
  { src: pearlLine, x: 403, width: 202 },
]

// 시안 좌표를 그대로 옮긴 장식 일러스트라 절대 위치를 쓴다.
const Panel = styled.div`
  position: relative;
  left: 9px;
  width: ${({ theme }) => theme.auth.layout.columnWidth};
  height: 924px;
  font-family: ${({ theme }) => theme.auth.font.family};

  img {
    position: absolute;
    max-width: none;
  }
`

const Page = styled.div`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: 22px;
  width: ${({ theme }) => theme.auth.layout.notebookWidth};
  height: ${({ theme }) => theme.auth.layout.notebookHeight};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.auth.radius.notebook};
  background: ${({ theme, $back }) => $back ? theme.auth.color.notebookShadow : theme.auth.color.surface};
`

const Copy = styled.div`
  position: absolute;
  top: 516px;
  left: 80px;
`

const Title = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.auth.color.textPrimary};
  font-size: ${({ theme }) => theme.auth.font.heading};
  font-weight: 700;
`

const Description = styled.p`
  margin: 11.8px 0 0;
  color: ${({ theme }) => theme.auth.color.textSecondary};
  font-size: ${({ theme }) => theme.auth.font.body};
  white-space: nowrap;
`

const Rings = styled.div`
  position: absolute;
  top: 104px;
  left: 672px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 78px;
  height: 703px;
`

const Ring = styled.div`
  position: relative;
  height: 27px;

  img {
    bottom: 0;
    left: 0;
  }
`

function PearlLines({ x, y }) {
  return pearlLines.map((line) => (
    <img
      key={line.x}
      src={line.src}
      width={line.width}
      height="12"
      alt=""
      style={{ top: y, left: x + line.x }}
    />
  ))
}

function NotebookPage({ top, back = false }) {
  return (
    <Page $top={top} $back={back}>
      <PearlLines x={22} y={27} />
      <img src={back ? notebookLinesBack : notebookLines} width="603.002" height="671" alt="" style={{ top: 72, left: 24 }} />
    </Page>
  )
}

export default function AuthBrandPanel() {
  return (
    <Panel>
      <NotebookPage top={43} back />
      <NotebookPage top={30} />
      <img src={logo} width="487.68" height="213.12" alt="너목보" style={{ top: 243.16, left: 104.16 }} />
      <Copy>
        <Title>
          교내 불편함을 지도 위에서
          <br />
          바로 신고하고 확인하세요
        </Title>
        <Description>평면도에서 장소를 고르고, 로드뷰로 확인하고, 처리 상태까지 한 곳에서.</Description>
      </Copy>
      <img src={sparkleLarge} width="70.4" height="70.4" alt="" style={{ top: 150, left: 598 }} />
      <img src={sparkleMint} width="35.2" height="35.2" alt="" style={{ top: 252, left: 626 }} />
      <img src={sparkle} width="38.4" height="38.4" alt="" style={{ top: 700, left: 70 }} />
      <img src={heart} width="44.8" height="41.6" alt="" style={{ top: 733.2, left: 580.84, transform: 'rotate(12deg)' }} />
      <img src={heartSmall} width="28" height="26" alt="" style={{ top: 177.37, left: 92.04, transform: 'rotate(-10deg)' }} />
      <img src={sparkleMintSmall} width="25.6" height="25.6" alt="" style={{ top: 126, left: 150 }} />
      <PearlLines x={58} y={817} />
      <Rings aria-hidden="true">
        {rings.map((ring, index) => (
          <Ring key={index}>
            <img src={ring} width="78" height="30.39" alt="" />
          </Ring>
        ))}
      </Rings>
    </Panel>
  )
}
