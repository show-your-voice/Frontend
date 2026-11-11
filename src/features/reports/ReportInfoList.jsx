import styled from 'styled-components'

const Info = styled.dl`
  display: grid;
  gap: ${({ theme }) => theme.report.detail.infoRowGap};
  margin: 0;
  padding: ${({ theme }) => theme.space[6]};
  border-radius: ${({ theme }) => theme.report.radius.card};
  background: ${({ theme }) => theme.report.color.detailSurface};
  line-height: ${({ theme }) => theme.report.font.lineHeight};
`

const Row = styled.div`
  display: grid;
  grid-template-columns: ${({ theme }) => theme.report.detail.infoLabelWidth} minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[6]};
  align-items: baseline;
  word-break: keep-all;
  overflow-wrap: anywhere;

  dt {
    color: ${({ theme }) => theme.report.color.body};
    font-size: ${({ theme }) => theme.report.font.body};
  }

  dd {
    min-width: 0;
    margin: 0;
    color: ${({ theme }) => theme.report.color.title};
    font-size: ${({ theme }) => theme.report.font.body};
  }

  @media (max-width: ${({ theme }) => theme.report.detail.compactBreakpoint}) {
    grid-template-columns: ${({ theme }) => theme.report.detail.mobileInfoLabelWidth} minmax(0, 1fr);
    gap: ${({ theme }) => theme.space[4]};

    dt { font-size: ${({ theme }) => theme.report.font.mobileBody}; }
    dd { font-size: ${({ theme }) => theme.report.font.small}; }
  }
`

const LocationPart = styled.span`
  display: inline-block;
  max-width: 100%;
  margin-right: ${({ theme }) => theme.space[1]};
`

const ManagerValue = styled.span`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
`

const AddManagerButton = styled.button`
  min-height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.report.color.focus};
  font: inherit;
  white-space: nowrap;
  cursor: pointer;

  &:hover { text-decoration: underline; }
  &:active { color: ${({ theme }) => theme.report.color.selectedText}; text-decoration: underline; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: 3px;
  }
`

export default function ReportInfoList({ location, category, author, date, manager, coAssignees = [], onAddCoAssignee }) {
  const managerNames = [manager, ...coAssignees.map((coAssignee) => coAssignee.name)].filter(Boolean)
  const fields = [
    {
      label: '장소',
      value: location && location.split(' · ').map((part, index) => (
        <LocationPart key={`${index}-${part}`}>{index > 0 && '· '}{part}</LocationPart>
      )),
    },
    { label: '카테고리', value: category },
    { label: '신고자', value: author },
    { label: '접수일', value: date && <time dateTime={date}>{date.replaceAll('-', '.')}</time> },
    {
      label: '담당 관리자',
      value: (
        <ManagerValue>
          <span>{managerNames.join(', ') || '—'}</span>
          {onAddCoAssignee && <AddManagerButton type="button" onClick={onAddCoAssignee}>+ 공동 담당자 추가</AddManagerButton>}
        </ManagerValue>
      ),
    },
  ]

  return (
    <Info aria-label="신고 상세 정보">
      {fields.map(({ label, value }) => (
        <Row key={label}><dt>{label}</dt><dd>{value || '—'}</dd></Row>
      ))}
    </Info>
  )
}
