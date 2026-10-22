import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import FilterChip from '../../components/FilterChip.jsx'
import ReportCard from './ReportCard.jsx'

const filters = [
  { value: 'all', label: '전체' },
  { value: 'received', label: '접수' },
  { value: 'inProgress', label: '처리 중' },
  { value: 'completed', label: '처리 완료' },
]

const Panel = styled.section`
  width: 100%;
  max-width: ${({ theme }) => theme.report.layout.panelWidth};
  padding: ${({ theme }) => theme.report.layout.panelPadding};
  padding-bottom: ${({ theme }) => theme.report.layout.panelBottom};
  border-radius: ${({ theme }) => theme.report.radius.panel};
  background: ${({ theme }) => theme.report.color.surface};

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    padding: ${({ theme }) => theme.space[5]};
    padding-bottom: ${({ theme }) => theme.space[8]};
    border-radius: ${({ theme }) => theme.report.radius.card};
  }
`

const Heading = styled.h1`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[2]};
  margin: 0 0 ${({ theme }) => theme.space[6]};
  color: ${({ theme }) => theme.report.color.title};
  font-size: ${({ theme }) => theme.report.font.heading};
  font-weight: 600;
  line-height: ${({ theme }) => theme.report.font.lineHeight};
`

const Count = styled.span`
  color: ${({ theme }) => theme.report.color.accent};
  font-weight: 400;
`

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[6]};

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    gap: ${({ theme }) => theme.space[2]};
  }
`

const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.report.layout.listGap};
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    min-width: 0;
  }
`

export default function ReportList({ reports, selectedStatus = 'all', onStatusChange, onSelectReport, focusReportId }) {
  const headingRef = useRef(null)
  const focusedReportRef = useRef(null)
  useEffect(() => {
    const target = focusedReportRef.current ?? headingRef.current
    target?.focus()
  }, [focusReportId])

  const visibleReports = selectedStatus === 'all'
    ? reports
    : reports.filter((report) => report.status.tone === selectedStatus)

  return (
    <Panel aria-labelledby="report-list-heading">
      <Heading id="report-list-heading" ref={headingRef} tabIndex={-1}>
        불편 신고 <Count aria-live="polite">{visibleReports.length}</Count>
      </Heading>
      <Filters role="group" aria-label="처리 상태 필터">
        {filters.map((filter) => (
          <FilterChip
            key={filter.value}
            selected={selectedStatus === filter.value}
            onClick={() => onStatusChange(filter.value)}
          >
            {filter.label}
          </FilterChip>
        ))}
      </Filters>
      <List>
        {visibleReports.map((report) => (
          <li key={report.id}>
            <ReportCard
              {...report}
              onOpen={() => onSelectReport(report)}
              buttonRef={report.id === focusReportId ? focusedReportRef : undefined}
            />
          </li>
        ))}
      </List>
    </Panel>
  )
}
