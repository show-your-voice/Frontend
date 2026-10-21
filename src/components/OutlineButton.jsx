import styled from 'styled-components'

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: ${({ theme, $large }) =>
    $large ? theme.report.detail.deleteHeight : theme.report.overview.buttonHeight};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  border: 2px solid ${({ theme, $danger }) =>
    $danger ? theme.report.color.danger : theme.report.color.border};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.report.color.surface};
  color: ${({ theme, $danger }) =>
    $danger ? theme.report.color.danger : theme.report.color.accent};
  font-size: ${({ theme, $large }) =>
    $large ? theme.report.font.title : theme.report.font.mobileBody};
  line-height: ${({ theme }) => theme.report.font.lineHeight};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.report.color.hover};
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.report.color.selected};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: 3px;
  }

  &:disabled {
    cursor: default;
  }
`

export default function OutlineButton({ children, danger = false, large = false, ...props }) {
  return (
    <Button type="button" $danger={danger} $large={large} {...props}>
      {children}
    </Button>
  )
}
