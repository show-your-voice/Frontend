import { useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.toast.bottom};
  left: 50%;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.toast.gap};
  padding: ${({ theme }) => theme.toast.padding};
  border-radius: ${({ theme }) => theme.toast.radius};
  background: ${({ theme }) => theme.toast.color.surface};
  box-shadow: ${({ theme }) => theme.toast.color.shadow};
  color: ${({ theme }) => theme.toast.color.text};
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transform: translateX(-50%);

  svg { width: 20px; height: 20px; }
`

export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <Container role="status">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m5 12 5 5 9-10" />
      </svg>
      {message}
    </Container>
  )
}
