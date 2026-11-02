import styled from 'styled-components'
import Modal from '../../components/Modal.jsx'

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.report.modal.actionGap};
  margin-top: ${({ theme }) => theme.report.modal.actionMargin};
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${({ theme }) => theme.report.modal.buttonHeight};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme, $danger }) => $danger ? theme.report.modal.color.danger : theme.report.modal.color.cancel};
  color: ${({ theme, $danger }) => $danger ? theme.report.color.surface : theme.report.color.title};
  font-size: ${({ theme }) => theme.report.font.body};
  line-height: inherit;
  cursor: pointer;

  &:hover {
    background: ${({ theme, $danger }) => $danger ? theme.report.modal.color.dangerHover : theme.report.color.hover};
  }

  &:active {
    background: ${({ theme, $danger }) => $danger ? theme.report.modal.color.dangerActive : theme.report.color.selected};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: 3px;
  }

  @media (max-width: ${({ theme }) => theme.report.detail.compactBreakpoint}) {
    min-height: ${({ theme }) => theme.report.detail.deleteHeight};
    font-size: ${({ theme }) => theme.report.font.small};
  }
`

export default function ReportDeleteModal({ onCancel, onConfirm }) {
  return (
    <Modal title="이 신고를 삭제할까요?" description="삭제한 신고는 되돌릴 수 없어요." onClose={onCancel}>
      <Actions>
        <ActionButton type="button" autoFocus onClick={onCancel}>취소</ActionButton>
        <ActionButton type="button" $danger onClick={onConfirm}>삭제</ActionButton>
      </Actions>
    </Modal>
  )
}
