import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { fetchMe } from './features/auth/authApi.js'
import LoginForm from './features/auth/LoginForm.jsx'
import SignupForm from './features/auth/SignupForm.jsx'
import ReportList from './features/reports/ReportList.jsx'
import ReportOverview from './features/reports/ReportOverview.jsx'
import ReportDetail from './features/reports/ReportDetail.jsx'
import { reportDetailPreviewData, reportOverviewPreviewData, reportPreviewData } from './features/reports/reportPreviewData.js'
import ManagerInfoPage from './features/managers/ManagerInfoPage.jsx'
import { managerPreviewData } from './features/managers/managerPreviewData.js'

const Page = styled.main`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100dvh;
  padding: ${({ theme, $detail }) => $detail ? 0 : theme.report.layout.pagePadding};
  background: ${({ theme, $detail }) => $detail ? theme.report.color.surface : theme.report.color.background};
  font-family: ${({ theme }) => theme.report.font.family};
  color-scheme: light;

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    padding: ${({ theme, $detail }) => $detail ? 0 : theme.space[3]};
  }
`

export default function App() {
  // null은 세션으로 로그인 상태를 확인하는 중이다.
  const [view, setView] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedReport, setSelectedReport] = useState(null)

  useEffect(() => {
    let ignore = false
    fetchMe()
      .then(() => !ignore && setView('overview'))
      .catch(() => !ignore && setView('login'))
    return () => {
      ignore = true
    }
  }, [])

  if (['/managers', '/managers/'].includes(window.location.pathname)) {
    return <ManagerInfoPage managers={managerPreviewData} />
  }

  function openReport(report) {
    setSelectedReport({ ...report, ...reportDetailPreviewData[report.id] })
    setView('detail')
  }

  if (view === null) return null

  // 신고 화면은 아직 API 연동 전 미리보기 데이터를 쓴다.
  if (view === 'login') {
    return <LoginForm onLogin={() => setView('overview')} onSignupClick={() => setView('signup')} />
  }

  if (view === 'signup') {
    return <SignupForm onSignup={() => setView('login')} onLoginClick={() => setView('login')} />
  }

  return (
    <Page $detail={view === 'detail'}>
      {view === 'overview' && (
        <ReportOverview
          {...reportOverviewPreviewData}
          onViewAll={() => setView('list')}
        />
      )}
      {view === 'list' && (
        <ReportList
          reports={reportPreviewData}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onSelectReport={openReport}
          focusReportId={selectedReport?.id}
        />
      )}
      {view === 'detail' && (
        <ReportDetail report={selectedReport} onBack={() => setView('list')} />
      )}
    </Page>
  )
}
