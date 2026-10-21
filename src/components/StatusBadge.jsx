import styled from 'styled-components'

const Badge = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme, $tone }) => theme.report.color.status[$tone].background};
  color: ${({ theme, $tone }) => theme.report.color.status[$tone].text};
  font-size: ${({ theme }) => theme.report.font.small};
  font-weight: 500;
  line-height: ${({ theme }) => theme.report.font.lineHeight};
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    padding-inline: ${({ theme }) => theme.space[3]};
    font-size: ${({ theme }) => theme.report.font.mobileSmall};
  }
`

export default function StatusBadge({ children, tone }) {
  return <Badge $tone={tone}>{children}</Badge>
}
