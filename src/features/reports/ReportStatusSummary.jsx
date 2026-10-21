import styled from 'styled-components'

const Summary = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.report.overview.tileGap};
  margin: 0;
`

const Status = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.report.overview.countGap};
  min-height: ${({ theme }) => theme.report.overview.tileHeight};
  border-radius: ${({ theme }) => theme.report.overview.tileRadius};
  background: ${({ theme, $tone }) => theme.report.color.status[$tone].background};
  color: ${({ theme, $tone }) => theme.report.color.status[$tone].text};
`

const Label = styled.dt`
  font-size: ${({ theme }) => theme.report.font.mobileBody};
  line-height: ${({ theme }) => theme.report.font.lineHeight};
`

const Count = styled.dd`
  order: -1;
  margin: 0;
  font-size: ${({ theme }) => theme.report.overview.countSize};
  font-weight: 600;
  line-height: ${({ theme }) => theme.report.overview.countLineHeight};
`

export default function ReportStatusSummary({ statuses }) {
  return (
    <Summary aria-label="처리 상태별 신고 수">
      {statuses.map(({ tone, label, count }) => (
        <Status key={tone} $tone={tone}>
          <Label>{label}</Label>
          <Count>{count}</Count>
        </Status>
      ))}
    </Summary>
  )
}
