import styled from 'styled-components'

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $selected }) =>
    $selected ? '#f7b6d4' : '#f4eef1'};
  color: ${({ theme, $selected }) =>
    $selected ? theme.report.color.selectedText : theme.report.color.body};
  font-size: 14px;
  line-height: ${({ theme }) => theme.report.font.lineHeight};
  font-weight: ${({ $selected }) => ($selected ? 500 : 400)};
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${({ theme, $selected }) =>
      $selected ? theme.report.color.selected : theme.report.color.hover};
  }

  &:active {
    background: ${({ theme }) => theme.report.color.selected};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: 3px;
  }

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) { padding-inline: ${({ theme }) => theme.space[3]}; }
`

export default function FilterChip({ children, selected = false, onClick }) {
  return (
    <Chip type="button" $selected={selected} aria-pressed={selected} onClick={onClick}>
      {children}
    </Chip>
  )
}
