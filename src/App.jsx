import styled from 'styled-components'
import ReportList from './features/reports/ReportList.jsx'
import { reportPreviewData } from './features/reports/reportPreviewData.js'

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
  return (
    <Page>
      <ReportList reports={reportPreviewData} />
    </Page>
  )
}
