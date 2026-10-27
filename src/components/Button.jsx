import styled, { css } from 'styled-components'

const primary = css`
  width: 100%;
  min-width: 120px;
  min-height: ${({ theme }) => theme.auth.layout.buttonHeight};
  padding: 0 28px;
  background: ${({ theme }) => theme.auth.color.brand};
  color: ${({ theme }) => theme.auth.color.onBrand};
  font-size: ${({ theme }) => theme.auth.font.body};
`

const text = css`
  min-height: ${({ theme }) => theme.auth.layout.textButtonHeight};
  padding: 0 ${({ theme }) => theme.space[1]};
  background: transparent;
  color: ${({ theme }) => theme.auth.color.brand};
  font-size: ${({ theme }) => theme.auth.font.label};
`

const StyledButton = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  font-weight: 500;
  line-height: ${({ theme }) => theme.auth.font.lineHeight};
  letter-spacing: inherit;
  white-space: nowrap;
  cursor: pointer;
  ${({ $variant }) => $variant === 'text' ? text : primary}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.auth.color.brand};
    outline-offset: 3px;
  }
`

export default function Button({ children, variant = 'primary', type = 'button', ...props }) {
  return (
    <StyledButton type={type} $variant={variant} {...props}>
      {children}
    </StyledButton>
  )
}
