import styled from 'styled-components'

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: ${({ theme }) => theme.report.layout.filterHeight};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[5]};
  border: 2px solid ${({ theme, $selected }) =>
    $selected ? theme.report.color.selected : theme.report.color.border};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme, $selected }) =>
    $selected ? theme.report.color.selected : theme.report.color.surface};
  color: ${({ theme, $selected }) =>
    $selected ? theme.report.color.selectedText : theme.report.color.body};
  font-size: ${({ theme }) => theme.report.font.body};
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

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    min-height: ${({ theme }) => theme.report.layout.mobileFilterHeight};
    padding-inline: ${({ theme }) => theme.space[3]};
    font-size: ${({ theme }) => theme.report.font.mobileBody};
  }
`

export default function FilterChip({ children, selected = false, onClick }) {
  return (
    <Chip type="button" $selected={selected} aria-pressed={selected} onClick={onClick}>
      {children}
    </Chip>
  )
}
