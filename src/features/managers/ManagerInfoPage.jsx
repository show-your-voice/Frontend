import { useEffect, useId, useState } from 'react'
import styled from 'styled-components'
import OutlineButton from '../../components/OutlineButton.jsx'
import PageIntro from '../../components/PageIntro.jsx'
import { fetchManagers } from '../reports/reportApi.js'
import ManagerTable from './ManagerTable.jsx'

const Page = styled.main`
  min-height: calc(100dvh - 64px);
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

export default function ManagerInfoPage() {
  const headingId = useId()
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState(null)
  const currentResult = result?.attempt === attempt ? result : null

  useEffect(() => {
    let ignore = false

    fetchManagers()
      .then((managers) => {
        if (!ignore) setResult({ attempt, managers })
      })
      .catch((error) => {
        if (!ignore) setResult({ attempt, errorMessage: error.status === 401
          ? '로그인 후 다시 시도해 주세요.'
          : '담당자 정보를 불러오지 못했어요.' })
      })

    return () => { ignore = true }
  }, [attempt])

  return (
    <Page>
      <Content>
        <PageIntro
          title="담당자 정보"
          description="장소별로 불편 신고를 처리하는 담당 선생님을 확인할 수 있어요."
          headingId={headingId}
        />
        {!currentResult && <p role="status">담당자 정보를 불러오는 중이에요.</p>}
        {currentResult?.errorMessage && (
          <div role="alert">
            <p>{currentResult.errorMessage}</p>
            <OutlineButton onClick={() => setAttempt((value) => value + 1)}>다시 시도</OutlineButton>
          </div>
        )}
        {currentResult?.managers && <ManagerTable managers={currentResult.managers} labelledBy={headingId} />}
      </Content>
    </Page>
  )
}
