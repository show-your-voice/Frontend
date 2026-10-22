import styled from 'styled-components'
import StatusBadge from '../../components/StatusBadge.jsx'

const Card = styled.article`
  position: relative;
  min-width: 0;
  padding: ${({ theme }) => theme.report.layout.cardPaddingBlock}
    ${({ theme }) => theme.report.layout.cardPaddingInline};
  border: 2px solid ${({ theme }) => theme.report.color.border};
  border-radius: ${({ theme }) => theme.report.radius.card};
  background: ${({ theme }) => theme.report.color.surface};

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: 3px;
  }

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    padding: ${({ theme }) => theme.space[5]};
  }
`

const OpenButton = styled.button`
  display: block;
  width: 100%;
  overflow: hidden;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;

  &::after {
    position: absolute;
    inset: 0;
    content: '';
    border-radius: ${({ theme }) => theme.report.radius.card};
  }

  &:focus-visible { outline: none; }
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[3]};
`

const Title = styled.h2`
  min-width: 0;
  margin: 0;
  overflow: hidden;
  color: ${({ theme }) => theme.report.color.title};
  font-size: ${({ theme }) => theme.report.font.title};
  font-weight: 600;
  line-height: ${({ theme }) => theme.report.font.lineHeight};
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    font-size: ${({ theme }) => theme.report.font.small};
  }
`

const Description = styled.p`
  margin: 0 0 ${({ theme }) => theme.space[3]};
  overflow: hidden;
  color: ${({ theme }) => theme.report.color.body};
  font-size: ${({ theme }) => theme.report.font.body};
  line-height: ${({ theme }) => theme.report.font.lineHeight};
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    font-size: ${({ theme }) => theme.report.font.mobileBody};
  }
`

const Metadata = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[1]} 0;
  margin: 0;
  padding: 0;
  list-style: none;
  color: ${({ theme }) => theme.report.color.muted};
  font-size: ${({ theme }) => theme.report.font.small};
  line-height: ${({ theme }) => theme.report.font.lineHeight};

  li {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  li + li::before {
    content: '·';
    margin-inline: ${({ theme }) => theme.space[3]};
  }

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    font-size: ${({ theme }) => theme.report.font.mobileSmall};

    li:last-child {
      flex-basis: 100%;
    }

    li:last-child::before {
      content: none;
    }
  }
`

export default function ReportCard({ title, description, date, author, location, status, onOpen, buttonRef }) {
  return (
    <Card>
      <CardHeader>
        <Title title={title}>
          <OpenButton ref={buttonRef} type="button" onClick={onOpen} aria-label={`${title} 상세 보기`}>
            {title}
          </OpenButton>
        </Title>
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </CardHeader>
      <Description title={description}>{description}</Description>
      <Metadata aria-label="신고 정보">
        <li><time dateTime={date}>{date.replaceAll('-', '.')}</time></li>
        <li>{author}</li>
        <li>{location}</li>
      </Metadata>
    </Card>
  )
}
