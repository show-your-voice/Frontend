import styled, { css } from 'styled-components'
import alertIcon from '../assets/icons/alert.svg'

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.auth.layout.fieldGap};
  width: 100%;
`

const Label = styled.label`
  color: ${({ theme }) => theme.auth.color.textPrimary};
  font-size: ${({ theme }) => theme.auth.font.label};
  font-weight: 500;
`

const multiline = css`
  height: ${({ theme }) => theme.reportForm.layout.textareaHeight};
  padding: ${({ theme }) => theme.reportForm.layout.textareaPaddingTop} ${({ theme }) => theme.space[4]};
  border-width: 1.5px;
  border-radius: ${({ theme }) => theme.radius.md};
  line-height: ${({ theme }) => theme.auth.font.lineHeight};
  resize: vertical;
`

const Input = styled.input`
  display: block;
  width: 100%;
  height: ${({ theme }) => theme.auth.layout.fieldHeight};
  padding: 0 ${({ theme }) => theme.space[4]};
  border: ${({ theme, $invalid }) =>
    $invalid ? `1px solid ${theme.auth.color.error}` : `1.5px solid ${theme.auth.color.border}`};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme, $invalid }) => $invalid ? theme.auth.color.errorSurface : theme.auth.color.surface};
  color: ${({ theme }) => theme.auth.color.textPrimary};
  font-size: ${({ theme }) => theme.auth.font.body};
  letter-spacing: inherit;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.auth.color.textTertiary};
    opacity: 1;
  }

  &:focus {
    border-color: ${({ theme, $invalid }) => $invalid ? theme.auth.color.error : theme.auth.color.brand};
  }

  ${({ $multiline }) => $multiline && multiline}
`

const Control = styled.div`
  position: relative;
`

const Helper = styled.p`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[1]};
  margin: 0;
  color: ${({ theme, $invalid }) => $invalid ? theme.auth.color.error : theme.auth.color.textTertiary};
  font-size: ${({ theme }) => theme.auth.font.caption};
  word-break: keep-all;
  overflow-wrap: anywhere;

  img {
    flex-shrink: 0;
    margin-top: 1px;
  }
`

// invalid는 메시지 없이 오류 테두리만 보여야 할 때 쓴다.
export default function TextField({
  id,
  label,
  helper,
  error,
  invalid = Boolean(error),
  multiline = false,
  children,
  ...inputProps
}) {
  const message = error || helper
  const messageId = message ? `${id}-message` : undefined

  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <Control>
        <Input
          as={multiline ? 'textarea' : 'input'}
          id={id}
          $invalid={invalid}
          $multiline={multiline}
          aria-invalid={invalid || undefined}
          aria-describedby={messageId}
          {...inputProps}
        />
        {children}
      </Control>
      {message && (
        <Helper id={messageId} $invalid={Boolean(error)}>
          {error && <img src={alertIcon} width="16" height="16" alt="" />}
          {message}
        </Helper>
      )}
    </Field>
  )
}
