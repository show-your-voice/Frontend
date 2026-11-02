import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

const Dialog = styled.dialog`
  width: calc(100% - ${({ theme }) => theme.space[8]});
  max-width: ${({ theme }) => theme.report.modal.width};
  max-height: calc(100dvh - ${({ theme }) => theme.space[8]});
  margin: auto;
  padding: ${({ theme }) => theme.report.modal.padding};
  padding-bottom: ${({ theme }) => theme.report.modal.paddingBottom};
  overflow-y: auto;
  border: 0;
  border-radius: ${({ theme }) => theme.report.modal.radius};
  background: ${({ theme }) => theme.report.color.surface};
  color: ${({ theme }) => theme.report.color.title};
  font-family: ${({ theme }) => theme.report.font.family};
  line-height: ${({ theme }) => theme.report.font.lineHeight};
  color-scheme: light;

  &::backdrop {
    background: ${({ theme }) => theme.report.modal.color.backdrop};
  }

  @media (max-width: ${({ theme }) => theme.report.detail.compactBreakpoint}) {
    padding: ${({ theme }) => theme.space[6]};
    border-radius: ${({ theme }) => theme.report.radius.card};
  }
`

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.report.font.heading};
  font-weight: 600;
  word-break: keep-all;
  overflow-wrap: anywhere;

  @media (max-width: ${({ theme }) => theme.report.detail.compactBreakpoint}) {
    font-size: ${({ theme }) => theme.report.font.body};
  }
`

const Description = styled.p`
  margin: ${({ theme }) => theme.space[3]} 0 0;
  color: ${({ theme }) => theme.report.color.body};
  font-size: ${({ theme }) => theme.report.font.small};
  word-break: keep-all;
  overflow-wrap: anywhere;

  @media (max-width: ${({ theme }) => theme.report.detail.compactBreakpoint}) {
    font-size: ${({ theme }) => theme.report.font.mobileBody};
  }
`

export default function Modal({ title, description, onClose, children }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow

    dialog.showModal()
    document.body.style.overflow = 'hidden'

    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [])

  function cancel(event) {
    event.preventDefault()
    onClose()
  }

  function keepFocus(event) {
    if (event.key !== 'Tab') return

    const dialog = event.currentTarget
    const controls = Array.from(dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]',
    )).filter((element) => element.tabIndex >= 0 && !element.matches(':disabled') && element.getClientRects().length > 0)
    const first = controls[0]
    const last = controls[controls.length - 1]

    if (!first) {
      event.preventDefault()
      dialog.focus()
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return createPortal(
    <Dialog ref={dialogRef} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} onCancel={cancel} onKeyDown={keepFocus}>
      <Title id={titleId}>{title}</Title>
      {description && <Description id={descriptionId}>{description}</Description>}
      {children}
    </Dialog>,
    document.body,
  )
}
