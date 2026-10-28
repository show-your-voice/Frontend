import styled from 'styled-components'
import alertIcon from '../assets/icons/alert.svg'

const Message = styled.p`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[1]};
  margin: 0;
  color: ${({ theme }) => theme.auth.color.error};
  font-size: ${({ theme }) => theme.auth.font.caption};
  word-break: keep-all;
  overflow-wrap: anywhere;

  img {
    flex-shrink: 0;
    margin-top: 1px;
  }
`

export default function FieldError({ id, children }) {
  if (!children) return null

  return (
    <Message id={id} role="alert">
      <img src={alertIcon} width="16" height="16" alt="" />
      {children}
    </Message>
  )
}
