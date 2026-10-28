import styled, { css } from 'styled-components'

const large = css`
  min-width: 120px;
  min-height: ${({ theme }) => theme.auth.layout.buttonHeight};
  padding: 0 28px;
  font-size: ${({ theme }) => theme.auth.font.body};
`

const primary = css`
  ${large}
  background: ${({ theme }) => theme.auth.color.brand};
  color: ${({ theme }) => theme.auth.color.onBrand};
`

const neutral = css`
  ${large}
  background: ${({ theme }) => theme.auth.color.neutral};
  color: ${({ theme }) => theme.auth.color.textPrimary};
`

const text = css`
  min-height: ${({ theme }) => theme.auth.layout.textButtonHeight};
  padding: 0 ${({ theme }) => theme.space[1]};
  background: transparent;
  color: ${({ theme }) => theme.auth.color.brand};
  font-size: ${({ theme }) => theme.auth.font.label};
`

const variants = { primary, neutral, text }

const StyledButton = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  font-weight: 500;
  line-height: ${({ theme }) => theme.auth.font.lineHeight};
  letter-spacing: inherit;
  white-space: nowrap;
  cursor: pointer;
  ${({ $variant }) => variants[$variant] ?? primary}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.auth.color.brand};
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`

export default function Button({
  children,
  variant = 'primary',
  fullWidth = variant === 'primary',
  type = 'button',
  ...props
}) {
  return (
    <StyledButton type={type} $variant={variant} $fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  )
}
