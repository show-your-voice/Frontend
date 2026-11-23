import styled from 'styled-components'
import Button from '../../components/Button.jsx'
import TextField from '../../components/TextField.jsx'
import { CODE_RULE, CODE_SENT, EMAIL_VERIFIED } from './authValidation.js'

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.auth.layout.fieldGap};
  width: 100%;
`

const Slot = styled.div`
  flex: 1;
  min-width: 0;
`

const CodeSlot = styled(Slot)`
  input {
    padding-right: 64px;
  }
`

const Action = styled.div`
  padding-top: ${({ theme }) => theme.auth.layout.fieldActionOffset};
`

const Timer = styled.span`
  position: absolute;
  top: 50%;
  right: ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.auth.color.brand};
  font-size: ${({ theme }) => theme.auth.font.label};
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  transform: translateY(-50%);
  pointer-events: none;
`

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

// Enter는 가입 제출 대신 이 칸의 동작(번호 받기·확인)을 실행한다.
function onEnter(action) {
  return (event) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    action()
  }
}

// 피그마 02-1 인증 요청 → 02-2 번호 입력 → 02-3 불일치 → 02-4 인증 완료
// 칸에 속하지 않은 오류(errors.form)는 폼 공통 오류 자리에 보이도록 SignupForm이 넘긴다.
export default function EmailVerificationFields({ email, emailError, onEmailChange, verification }) {
  const { status, code, errors, secondsLeft, canConfirm, sending, verifying, codeRef } = verification
  const verified = status === 'verified'
  const sent = status === 'sent'
  const emailHelper = verified ? EMAIL_VERIFIED : sent ? CODE_SENT : undefined
  const sendLabel = verified ? '인증 완료' : sent ? '재전송' : '인증번호 받기'
  const send = () => verification.send(email)
  const confirm = () => verification.confirm(email)

  return (
    <>
      <Row>
        <Slot>
          <TextField
            id="signup-email"
            name="email"
            type="email"
            label="이메일"
            placeholder="이메일을 입력하세요"
            autoComplete="email"
            value={email}
            onChange={onEmailChange}
            onKeyDown={verified ? undefined : onEnter(send)}
            readOnly={verified}
            helper={emailHelper}
            success={verified}
            error={errors.email ?? emailError}
          />
        </Slot>
        <Action>
          <Button
            variant="secondary"
            size="medium"
            disabled={verified || sending}
            aria-busy={sending}
            onClick={send}
          >
            {sendLabel}
          </Button>
        </Action>
      </Row>
      {sent && (
        <Row>
          <CodeSlot>
            <TextField
              ref={codeRef}
              id="signup-code"
              name="code"
              label="인증번호"
              placeholder="6자리 숫자"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => verification.changeCode(event.target.value)}
              onKeyDown={onEnter(confirm)}
              helper={CODE_RULE}
              error={errors.code}
            >
              <Timer role="timer" aria-label={`남은 시간 ${formatTime(secondsLeft)}`}>
                {formatTime(secondsLeft)}
              </Timer>
            </TextField>
          </CodeSlot>
          <Action>
            <Button size="medium" disabled={!canConfirm} aria-busy={verifying} onClick={confirm}>
              확인
            </Button>
          </Action>
        </Row>
      )}
    </>
  )
}
