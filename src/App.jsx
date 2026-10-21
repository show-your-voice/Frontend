import { useState } from 'react'
import styled from 'styled-components'
import ReportList from './features/reports/ReportList.jsx'
import ReportOverview from './features/reports/ReportOverview.jsx'
import ReportDetail from './features/reports/ReportDetail.jsx'
import { reportDetailPreviewData, reportOverviewPreviewData, reportPreviewData } from './features/reports/reportPreviewData.js'

const Page = styled.main`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100dvh;
  padding: ${({ theme, $detail }) => $detail ? theme.report.detail.pagePadding : theme.report.layout.pagePadding};
  background: ${({ theme }) => theme.report.color.background};
  font-family: ${({ theme }) => theme.report.font.family};
  color-scheme: light;

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    padding: ${({ theme }) => theme.space[3]};
  }
`

export default function App() {
  const [view, setView] = useState('overview')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedReport, setSelectedReport] = useState(null)

  function openReport(report) {
    setSelectedReport({ ...report, ...reportDetailPreviewData[report.id] })
    setView('detail')
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
