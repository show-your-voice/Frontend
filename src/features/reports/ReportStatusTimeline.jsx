import styled from 'styled-components'

const Timeline = styled.ol`
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: ${({ theme }) => theme.report.font.body};
  line-height: ${({ theme }) => theme.report.font.lineHeight};

  &::before {
    position: absolute;
    top: calc((${({ theme }) => theme.report.detail.timelineDot} - ${({ theme }) => theme.report.detail.timelineLine}) / 2);
    right: calc(${({ theme }) => theme.report.detail.timelineDot} / 2);
    left: calc(${({ theme }) => theme.report.detail.timelineDot} / 2);
    height: ${({ theme }) => theme.report.detail.timelineLine};
    background: ${({ theme }) => theme.report.color.timeline};
    content: '';
  }

  @media (max-width: ${({ theme }) => theme.report.detail.compactBreakpoint}) {
    font-size: ${({ theme }) => theme.report.font.mobileBody};
  }
`

const Step = styled.li`
  position: relative;
  min-width: 0;
  color: ${({ theme, $current }) => $current ? theme.report.color.title : theme.report.color.muted};
  text-align: center;

  &::before {
    display: block;
    width: ${({ theme }) => theme.report.detail.timelineDot};
    height: ${({ theme }) => theme.report.detail.timelineDot};
    margin: 0 auto ${({ theme }) => theme.space[2]};
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme, $current }) => $current ? theme.report.color.accent : theme.report.color.timeline};
    content: '';
  }

  &:first-child {
    text-align: left;
    &::before { margin-left: 0; }
  }

  &:last-child {
    text-align: right;
    &::before { margin-right: 0; }
  }
`

const Date = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.report.color.muted};
`

export default function ReportStatusTimeline({ currentStatus, receivedAt, startedAt, completedAt }) {
  const steps = [
    { status: 'received', label: '접수', date: receivedAt },
    { status: 'inProgress', label: '처리 중', date: startedAt },
    { status: 'completed', label: '처리 완료', date: completedAt },
  ]

  return (
    <Timeline aria-label="처리 이력">
      {steps.map(({ status, label, date }) => (
        <Step key={status} $current={status === currentStatus} aria-current={status === currentStatus ? 'step' : undefined}>
          {label}
          <Date>{date ? <time dateTime={date}>{date.slice(5, 10).replace('-', '.')}</time> : '—'}</Date>
        </Step>
      ))}
    </Timeline>
  )
}
