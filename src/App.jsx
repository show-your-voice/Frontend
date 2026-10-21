import { useState } from 'react'
import styled from 'styled-components'
import ReportList from './features/reports/ReportList.jsx'
import ReportOverview from './features/reports/ReportOverview.jsx'
import { reportOverviewPreviewData, reportPreviewData } from './features/reports/reportPreviewData.js'

const Page = styled.main`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100dvh;
  padding: ${({ theme }) => theme.report.layout.pagePadding};
  background: ${({ theme }) => theme.report.color.background};
  font-family: ${({ theme }) => theme.report.font.family};
  color-scheme: light;

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    padding: ${({ theme }) => theme.space[3]};
  }
`

export default function App() {
  const [showAllReports, setShowAllReports] = useState(false)

  return (
    <Page>
      {showAllReports ? (
        <ReportList reports={reportPreviewData} focusHeading />
      ) : (
        <ReportOverview
          {...reportOverviewPreviewData}
          onViewAll={() => setShowAllReports(true)}
        />
      )}
    </Page>
  )
}
