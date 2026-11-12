import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import OutlineButton from '../../components/OutlineButton.jsx'
import ReportCoAssigneeModal from './ReportCoAssigneeModal.jsx'
import ReportDetail from './ReportDetail.jsx'
import { fetchReportDetail } from './reportApi.js'

const Page = styled.main`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: calc(100dvh - 64px);
  background: ${({ theme }) => theme.report.color.surface};
  font-family: ${({ theme }) => theme.report.font.family};
  color-scheme: light;
`

const StatePanel = styled.section`
  display: grid;
  align-content: center;
  justify-items: center;
  gap: ${({ theme }) => theme.space[4]};
  width: 100%;
  max-width: ${({ theme }) => theme.report.detail.width};
  min-height: calc(100dvh - 64px);
  padding: ${({ theme }) => theme.space[6]};
  color: ${({ theme }) => theme.report.color.muted};
  text-align: center;

  p { margin: 0; line-height: ${({ theme }) => theme.report.font.lineHeight}; }
`

export default function ManagerReportDetailPage() {
  const navigate = useNavigate()
  const { reportId } = useParams()
  const [requestVersion, setRequestVersion] = useState(0)
  const requestKey = `${reportId}:${requestVersion}`
  const [requestState, setRequestState] = useState({ key: '', report: null, errorMessage: '' })
  const [isCoAssigneeModalOpen, setIsCoAssigneeModalOpen] = useState(false)
  const isLoading = requestState.key !== requestKey
  const report = isLoading ? null : requestState.report
  const errorMessage = isLoading ? '' : requestState.errorMessage

  useEffect(() => {
    let ignore = false

    fetchReportDetail(reportId)
      .then((nextReport) => {
        if (!ignore) setRequestState({ key: requestKey, report: nextReport, errorMessage: '' })
      })
      .catch(() => {
        if (!ignore) {
          setRequestState({
            key: requestKey,
            report: null,
            errorMessage: '신고 상세를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
          })
        }
      })

    return () => {
      ignore = true
    }
  }, [reportId, requestKey])

  function retryReport() {
    setRequestVersion((version) => version + 1)
  }

  if (isLoading) {
    return (
      <Page>
        <StatePanel role="status" aria-live="polite">
          <p>신고 상세를 불러오는 중이에요.</p>
        </StatePanel>
      </Page>
    )
  }

  if (errorMessage || !report) {
    return (
      <Page>
        <StatePanel role="alert">
          <p>{errorMessage || '신고 상세를 찾지 못했어요.'}</p>
          <OutlineButton onClick={retryReport}>다시 시도</OutlineButton>
          <OutlineButton onClick={() => navigate('/manager/reports')}>목록으로</OutlineButton>
        </StatePanel>
      </Page>
    )
  }

  return (
    <Page>
      <ReportDetail
        report={report}
        onBack={() => navigate('/manager/reports')}
        onAddCoAssignee={() => setIsCoAssigneeModalOpen(true)}
      />
      {isCoAssigneeModalOpen && (
        <ReportCoAssigneeModal
          report={report}
          onCancel={() => setIsCoAssigneeModalOpen(false)}
          onAdded={(updatedReport) => {
            setRequestState({ key: requestKey, report: updatedReport, errorMessage: '' })
            setIsCoAssigneeModalOpen(false)
          }}
        />
      )}
    </Page>
  )
}
