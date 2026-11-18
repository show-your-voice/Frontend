import { useEffect, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import OutlineButton from '../../components/OutlineButton.jsx'
import ReportDetail from './ReportDetail.jsx'
import { deleteReport, fetchReportDetail } from './reportApi.js'

const Panel = styled.section`
  width: 100%;
  max-width: 420px;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  padding-top: ${({ theme }) => theme.space[6]};
  border-radius: 28px;
  background: ${({ theme }) => theme.report.color.surface};
`

const State = styled.div`
  display: grid;
  justify-items: center;
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[16]} ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.report.color.muted};
  font-size: 14px;
  text-align: center;

  p { margin: 0; }
`

function panelTheme(theme) {
  return {
    ...theme,
    report: {
      ...theme.report,
      font: { ...theme.report.font, ...theme.reportPanel.font },
      detail: { ...theme.report.detail, ...theme.reportPanel.detail },
    },
  }
}

export default function ReportDetailPanel({ reportId, onLoad, onBack, onDeleted }) {
  const [attempt, setAttempt] = useState(0)
  const requestKey = `${reportId}:${attempt}`
  const [result, setResult] = useState({ key: '' })
  const isLoading = result.key !== requestKey

  useEffect(() => {
    let ignore = false
    fetchReportDetail(reportId)
      .then((report) => {
        if (ignore) return
        setResult({ key: requestKey, report })
        onLoad?.(report)
      })
      .catch(() => { if (!ignore) setResult({ key: requestKey, error: true }) })
    return () => { ignore = true }
  }, [onLoad, reportId, requestKey])

  async function removeReport() {
    await deleteReport(reportId)
    onDeleted()
  }

  return (
    <Panel>
      {isLoading && <State role="status"><p>신고 상세를 불러오는 중이에요.</p></State>}
      {!isLoading && result.error && (
        <State role="alert">
          <p>신고 상세를 불러오지 못했어요.</p>
          <OutlineButton onClick={() => setAttempt((value) => value + 1)}>다시 시도</OutlineButton>
          <OutlineButton onClick={onBack}>목록으로</OutlineButton>
        </State>
      )}
      {!isLoading && result.report && (
        <ThemeProvider theme={panelTheme}>
          <ReportDetail report={result.report} onBack={onBack} onDelete={removeReport} />
        </ThemeProvider>
      )}
    </Panel>
  )
}
