import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import FilterChip from '../../components/FilterChip.jsx'
import OutlineButton from '../../components/OutlineButton.jsx'
import ReportCard from './ReportCard.jsx'

const filters = [
  { value: 'all', label: '전체' },
  { value: 'received', label: '접수' },
  { value: 'inProgress', label: '처리 중' },
  { value: 'completed', label: '처리 완료' },
]

const Panel = styled.section`
  width: 100%;
  max-width: 420px;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space[6]};
  border-radius: 28px;
  background: ${({ theme }) => theme.report.color.surface};

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    padding: ${({ theme }) => theme.space[5]};
    padding-bottom: ${({ theme }) => theme.space[8]};
    border-radius: ${({ theme }) => theme.report.radius.card};
  }
`

const Heading = styled.h2`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[2]};
  margin: 0 0 ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.report.color.title};
  font-size: 18px;
  font-weight: 500;
  line-height: ${({ theme }) => theme.report.font.lineHeight};
`

const Count = styled.span`
  color: ${({ theme }) => theme.report.color.accent};
  font-weight: 400;
`

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
  margin-bottom: ${({ theme }) => theme.space[4]};

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    gap: ${({ theme }) => theme.space[2]};
  }
`

const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    min-width: 0;
  }
`

const State = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[16]} ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.report.color.muted};
  text-align: center;
`

const StateMessage = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: ${({ theme }) => theme.report.font.lineHeight};
`

export default function ReportList({
  reports,
  title = '불편 신고',
  selectedStatus = 'all',
  onStatusChange,
  onSelectReport,
  focusReportId,
  isLoading = false,
  errorMessage,
  onRetry,
  emptyMessage = '등록된 신고가 없어요.',
}) {
  const headingRef = useRef(null)
  const focusedReportRef = useRef(null)
  useEffect(() => {
    if (focusReportId === undefined) return

    const target = focusedReportRef.current ?? headingRef.current
    target?.focus()
  }, [focusReportId])

  const visibleReports = selectedStatus === 'all'
    ? reports
    : reports.filter((report) => report.status.tone === selectedStatus)
  const noReportsMessage = selectedStatus === 'all'
    ? emptyMessage
    : '선택한 상태의 신고가 없어요.'

  return (
    <Panel aria-labelledby="report-list-heading">
      <Heading id="report-list-heading" ref={headingRef} tabIndex={-1}>
        {title} <Count aria-live="polite">{visibleReports.length}</Count>
      </Heading>
      <Filters role="group" aria-label="처리 상태 필터">
        {filters.map((filter) => (
          <FilterChip
            key={filter.value}
            selected={selectedStatus === filter.value}
            onClick={() => onStatusChange?.(filter.value)}
          >
            {filter.label}
          </FilterChip>
        ))}
      </Filters>
      {isLoading && (
        <State role="status" aria-live="polite">
          <StateMessage>신고 목록을 불러오는 중이에요.</StateMessage>
        </State>
      )}
      {!isLoading && errorMessage && (
        <State role="alert">
          <StateMessage>{errorMessage}</StateMessage>
          {onRetry && <OutlineButton onClick={onRetry}>다시 시도</OutlineButton>}
        </State>
      )}
      {!isLoading && !errorMessage && visibleReports.length === 0 && (
        <State role="status">
          <StateMessage>{noReportsMessage}</StateMessage>
        </State>
      )}
      {!isLoading && !errorMessage && visibleReports.length > 0 && (
        <List>
          {visibleReports.map((report) => (
            <li key={report.id}>
              <ReportCard
                {...report}
                onOpen={onSelectReport ? () => onSelectReport(report) : undefined}
                buttonRef={report.id === focusReportId ? focusedReportRef : undefined}
              />
            </li>
          ))}
        </List>
      )}
    </Panel>
  )
}
