import styled from 'styled-components'
import ReportStatusSummary from './ReportStatusSummary.jsx'

const Panel = styled.section`
  width: 100%;
  max-width: ${({ theme }) => theme.report.overview.width};
  padding: ${({ theme }) => theme.report.overview.padding};
  border: 1px solid ${({ theme }) => theme.report.color.border};
  border-radius: ${({ theme }) => theme.report.overview.radius};
  background: ${({ theme }) => theme.report.color.surface};
  box-shadow: ${({ theme }) => theme.report.overview.shadow};

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    padding: ${({ theme }) => theme.space[5]};
  }
`

const Heading = styled.h1`
  margin: 0 0 ${({ theme }) => theme.space[5]};
  color: ${({ theme }) => theme.report.color.title};
  font-size: ${({ theme }) => theme.report.font.body};
  font-weight: 600;
  line-height: ${({ theme }) => theme.report.font.lineHeight};
  word-break: keep-all;
  overflow-wrap: anywhere;
`

const Hint = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.report.overview.tileGap};
  margin: ${({ theme }) => theme.space[5]} 0 0;
  color: ${({ theme }) => theme.report.color.body};
  font-size: ${({ theme }) => theme.report.font.mobileBody};
  line-height: ${({ theme }) => theme.report.font.lineHeight};
  word-break: keep-all;
  overflow-wrap: anywhere;

  svg {
    flex-shrink: 0;
    width: ${({ theme }) => theme.report.overview.iconSize};
    height: ${({ theme }) => theme.report.overview.iconSize};
    color: ${({ theme }) => theme.report.color.accent};
  }
`

const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: ${({ theme }) => theme.report.overview.buttonHeight};
  margin-top: ${({ theme }) => theme.space[5]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  border: 2px solid ${({ theme }) => theme.report.color.border};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.report.color.surface};
  color: ${({ theme }) => theme.report.color.accent};
  font-size: ${({ theme }) => theme.report.font.mobileBody};
  line-height: ${({ theme }) => theme.report.font.lineHeight};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.report.color.hover};
  }

  &:active {
    background: ${({ theme }) => theme.report.color.selected};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: 3px;
  }
`

export default function ReportOverview({ location, statuses, onViewAll }) {
  return (
    <Panel aria-labelledby="report-overview-heading">
      <Heading id="report-overview-heading">{location} 신고 현황</Heading>
      <ReportStatusSummary statuses={statuses} />
      <Hint>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>핀을 누르면 장소별 신고와 로드뷰를 볼 수 있어요</span>
      </Hint>
      <ViewAllButton type="button" onClick={onViewAll}>
        전체 신고 목록 보기
      </ViewAllButton>
    </Panel>
  )
}
