import { useId, useRef, useState } from 'react'
import styled from 'styled-components'
import Modal from '../../components/Modal.jsx'
import { reportStatuses } from './reportApi.js'

const Section = styled.section`
  h2 {
    margin: 0 0 ${({ theme }) => theme.space[3]};
    font-size: ${({ theme }) => theme.report.font.mobileBody};
    font-weight: 500;
    line-height: ${({ theme }) => theme.report.font.lineHeight};
  }
`

const Options = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => theme.space[1]};
  border-radius: ${({ theme }) => theme.report.radius.card};
  background: ${({ theme }) => theme.report.color.detailSurface};
`

const Option = styled.button`
  min-height: ${({ theme }) => theme.report.detail.backHeight};
  padding: ${({ theme }) => theme.space[1]};
  border: 0;
  border-radius: ${({ theme }) => theme.space[3]};
  background: transparent;
  color: ${({ theme }) => theme.report.color.body};
  font-size: ${({ theme }) => theme.report.font.mobileSmall};
  line-height: ${({ theme }) => theme.report.font.lineHeight};
  word-break: keep-all;
  cursor: pointer;

  &[aria-current="true"] {
    background: ${({ theme }) => theme.report.color.surface};
    color: ${({ theme }) => theme.report.color.focus};
    cursor: default;
  }

  &:hover:not([aria-disabled="true"]) {
    background: ${({ theme }) => theme.report.color.hover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: -2px;
  }
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.report.modal.actionGap};
  margin-top: ${({ theme }) => theme.report.modal.actionMargin};
`

const Action = styled.button`
  min-height: ${({ theme }) => theme.report.detail.deleteHeight};
  padding: ${({ theme }) => theme.space[2]};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme, $primary }) => $primary ? theme.report.color.focus : theme.report.modal.color.cancel};
  color: ${({ theme, $primary }) => $primary ? theme.report.color.surface : theme.report.color.title};
  font: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: 3px;
  }

  &:disabled { cursor: wait; opacity: 0.6; }
`

export default function ReportStatusControl({ currentStatus, onChange }) {
  const titleId = useId()
  const cancelRef = useRef(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function save(status) {
    setIsSaving(true)
    setErrorMessage('')
    try {
      await onChange(status)
      setIsConfirming(false)
    } catch (error) {
      setErrorMessage(error.status === 401
        ? '로그인 후 다시 시도해 주세요.'
        : '처리 상태를 저장하지 못했어요. 다시 시도해 주세요.')
    } finally {
      setIsSaving(false)
    }
  }

  function select(status) {
    if (isSaving || status === currentStatus) return

    if (status === 'RESOLVED') {
      setErrorMessage('')
      setIsConfirming(true)
    } else {
      void save(status)
    }
  }

  function cancel() {
    if (isSaving) return
    setErrorMessage('')
    setIsConfirming(false)
  }

  return (
    <Section aria-labelledby={titleId}>
      <h2 id={titleId}>처리 상태 변경</h2>
      <Options aria-busy={isSaving}>
        {reportStatuses.map(({ code, label }) => {
          const isCurrent = code === currentStatus
          return (
            <Option
              key={code}
              type="button"
              aria-current={isCurrent ? 'true' : undefined}
              aria-disabled={isCurrent || isSaving}
              onClick={() => select(code)}
            >
              {label}{isCurrent && ' · 현재'}
            </Option>
          )
        })}
      </Options>
      {!isConfirming && errorMessage && <p role="alert">{errorMessage}</p>}
      {isConfirming && (
        <Modal
          title="처리 완료로 바꿀까요?"
          description="처리 완료일이 오늘 날짜로 기록돼요."
          onClose={cancel}
          initialFocusRef={cancelRef}
        >
          {errorMessage && <p role="alert">{errorMessage}</p>}
          <Actions>
            <Action type="button" ref={cancelRef} disabled={isSaving} onClick={cancel}>취소</Action>
            <Action type="button" $primary disabled={isSaving} onClick={() => save('RESOLVED')}>
              {isSaving ? '저장 중…' : '완료로 변경'}
            </Action>
          </Actions>
        </Modal>
      )}
    </Section>
  )
}
