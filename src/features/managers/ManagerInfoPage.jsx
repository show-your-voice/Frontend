import { useId } from 'react'
import styled from 'styled-components'
import PageIntro from '../../components/PageIntro.jsx'
import ManagerTable from './ManagerTable.jsx'

const Page = styled.main`
  min-height: 100dvh;
  padding: ${({ theme }) => theme.space[16]}
    ${({ theme }) => theme.manager.layout.pageInset}
    ${({ theme }) => theme.space[20]};
  background: ${({ theme }) => theme.manager.color.background};
  font-family: ${({ theme }) => theme.report.font.family};
  color-scheme: light;

  @media (max-width: ${({ theme }) => theme.manager.layout.tabletBreakpoint}) {
    padding-inline: ${({ theme }) => theme.space[6]};
  }

  @media (max-width: ${({ theme }) => theme.manager.layout.mobileBreakpoint}) {
    padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[4]}
      ${({ theme }) => theme.space[10]};
  }
`

const Content = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.manager.layout.introGap};
  width: 100%;
  max-width: ${({ theme }) => theme.manager.layout.maxWidth};
  margin-inline: auto;

  @media (max-width: ${({ theme }) => theme.manager.layout.mobileBreakpoint}) {
    gap: ${({ theme }) => theme.space[6]};
  }
`

export default function ManagerInfoPage({ managers = [] }) {
  const headingId = useId()

  return (
    <Page>
      <Content>
        <PageIntro
          title="담당자 정보"
          description="장소별로 불편 신고를 처리하는 담당 선생님을 확인할 수 있어요."
          headingId={headingId}
        />
        <ManagerTable managers={managers} labelledBy={headingId} />
      </Content>
    </Page>
  )
}
