import styled from 'styled-components'

const Badge = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  padding: ${({ theme, $large }) => $large ? theme.report.detail.badgePadding : theme.space[1]}
    ${({ theme, $large }) => $large ? theme.space[4] : '10px'};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme, $tone }) => theme.report.color.status[$tone].background};
  color: ${({ theme, $tone }) => theme.report.color.status[$tone].text};
  font-size: ${({ $large }) => $large ? '18px' : '13px'};
  font-weight: 500;
  line-height: ${({ theme }) => theme.report.font.lineHeight};
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    padding-inline: ${({ theme, $large }) => $large ? theme.space[4] : theme.space[3]};
    font-size: ${({ theme, $large }) => $large ? theme.report.font.small : theme.report.font.mobileSmall};
  }
`

export default function StatusBadge({ children, tone, large = false }) {
  return <Badge $tone={tone} $large={large}>{children}</Badge>
}
