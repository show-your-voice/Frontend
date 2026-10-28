import styled from 'styled-components'
import FieldError from '../../components/FieldError.jsx'

const Group = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.auth.layout.fieldGap};
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
`

const Legend = styled.legend`
  margin-bottom: ${({ theme }) => theme.auth.layout.fieldGap};
  padding: 0;
  color: ${({ theme }) => theme.auth.color.textPrimary};
  font-size: ${({ theme }) => theme.auth.font.label};
  font-weight: 500;
`

const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
`

const Radio = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
  pointer-events: none;
`

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.reportForm.layout.chipPaddingBlock} ${({ theme }) => theme.reportForm.layout.chipPaddingInline};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.reportForm.color.chip};
  color: ${({ theme }) => theme.reportForm.color.chipText};
  font-size: ${({ theme }) => theme.auth.font.label};
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;

  ${Radio}:checked + & {
    background: ${({ theme }) => theme.reportForm.color.chipSelected};
    color: ${({ theme }) => theme.reportForm.color.chipSelectedText};
  }

  ${Radio}:focus-visible + & {
    outline: 2px solid ${({ theme }) => theme.auth.color.brand};
    outline-offset: 2px;
  }
`

export default function ReportCategoryField({ name, categories, value, error, onChange }) {
  const errorId = error ? `${name}-error` : undefined

  return (
    <Group aria-describedby={errorId}>
      <Legend>카테고리</Legend>
      <Options>
        {categories.map((category) => (
          <label key={category}>
            <Radio
              type="radio"
              name={name}
              value={category}
              checked={value === category}
              onChange={onChange}
              aria-invalid={Boolean(error) || undefined}
            />
            <Chip>{category}</Chip>
          </label>
        ))}
      </Options>
      <FieldError id={errorId}>{error}</FieldError>
    </Group>
  )
}
