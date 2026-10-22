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
    color: ${({ theme }) => theme.report.color.muted};
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

export default function ReportInfoList({ location, category, author, date, manager }) {
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
    { label: '담당 관리자', value: manager },
  ]

  return (
    <Info aria-label="신고 상세 정보">
      {fields.map(({ label, value }) => (
        <Row key={label}><dt>{label}</dt><dd>{value || '—'}</dd></Row>
      ))}
    </Info>
  )
}
