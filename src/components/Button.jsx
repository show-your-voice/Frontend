import styled, { css } from 'styled-components'

const large = css`
  min-width: 120px;
  min-height: ${({ theme }) => theme.auth.layout.buttonHeight};
  padding: 0 28px;
  font-size: ${({ theme }) => theme.auth.font.body};
`

// 입력칸 옆에 붙는 버튼이라 높이를 입력칸(48px)에 맞춘다.
const medium = css`
  min-width: ${({ theme }) => theme.auth.layout.mediumButtonWidth};
  min-height: ${({ theme }) => theme.auth.layout.fieldHeight};
  padding: 0 ${({ theme }) => theme.auth.layout.mediumButtonPadding};
  font-size: ${({ theme }) => theme.auth.font.label};
`

const sizes = { large, medium }

const disabledLook = css`
  &:disabled {
    background: ${({ theme }) => theme.auth.color.disabled};
    color: ${({ theme }) => theme.auth.color.disabledText};
    opacity: 1;
  }
`

const primary = css`
  ${({ $size }) => sizes[$size] ?? large}
  background: ${({ theme }) => theme.auth.color.brand};
  color: ${({ theme }) => theme.auth.color.onBrand};
  ${disabledLook}
`

const secondary = css`
  ${({ $size }) => sizes[$size] ?? large}
  background: ${({ theme }) => theme.auth.color.brandSubtle};
  color: ${({ theme }) => theme.auth.color.brandStrong};
  ${disabledLook}
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

const variants = { primary, secondary, neutral, text }

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

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.auth.color.brand};
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }

  ${({ $variant }) => variants[$variant] ?? primary}
`

export default function Button({
  children,
  variant = 'primary',
  size = 'large',
  fullWidth = variant === 'primary' && size === 'large',
  type = 'button',
  ...props
}) {
  return (
    <StyledButton type={type} $variant={variant} $size={size} $fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  )
}
