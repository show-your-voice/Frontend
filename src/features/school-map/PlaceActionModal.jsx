import { useState } from 'react'
import styled from 'styled-components'
import Modal from '../../components/Modal.jsx'
import Button from '../../components/Button.jsx'
import closeIcon from '../../assets/place-action-close.svg'

const ActionModal = styled(Modal)`
  max-width: 380px;
  padding: 24px 28px 28px;
  border-radius: 28px;
  font-family: ${({ theme }) => theme.auth.font.family};
  line-height: 1.4;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.auth.color.textPrimary};

  &::backdrop { background: rgba(46, 43, 46, 0.4); }
  > h2 { padding-right: 30px; font-size: 20px; font-weight: 700; }
`

const Close = styled.button`
  position: absolute;
  top: 27px;
  right: 28px;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.auth.color.brand}; outline-offset: 3px; }
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`

const Notice = styled.p`
  margin: 12px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.auth.color.textPrimary};
`

export default function PlaceActionModal({ roomName, onClose, onReport }) {
  const [showNotice, setShowNotice] = useState(false)

  return (
    <ActionModal title={roomName} onClose={onClose}>
      <Close type="button" aria-label="닫기" onClick={onClose}><img src={closeIcon} alt="" /></Close>
      <Actions>
        <Button variant="neutral" fullWidth onClick={() => setShowNotice(true)}>로드뷰 보기</Button>
        <Button onClick={onReport}>불편 신고하기</Button>
      </Actions>
      {showNotice && <Notice role="status">로드뷰는 준비 중입니다.</Notice>}
    </ActionModal>
  )
}
