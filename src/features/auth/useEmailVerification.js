import { useEffect, useRef, useState } from 'react'
import { sendEmailVerification, verifyEmail } from './authApi.js'
import {
  CODE_EXPIRED,
  CODE_FORMAT,
  SCHOOL_EMAIL,
  SCHOOL_EMAIL_RULE,
  sendCodeErrorsFrom,
  VERIFICATION_CODE,
  verifyCodeErrorsFrom,
} from './authValidation.js'

const IDLE = { status: 'idle', deadline: 0, code: '', errors: {}, exhausted: false }

// 남은 시간은 서버가 준 expiresInSeconds로 브라우저 시계 기준 마감 시각을 잡아 센다.
// 서버와 브라우저 시계가 달라도 3분이 그대로 보인다.
function remainingSeconds(deadline, now) {
  return Math.max(0, Math.ceil((deadline - now) / 1000))
}

// 이메일 인증 단계: idle(번호 받기 전) → sent(번호 입력 중) → verified(인증 완료)
export default function useEmailVerification() {
  const [state, setState] = useState(IDLE)
  const [now, setNow] = useState(() => Date.now())
  const [pending, setPending] = useState(null)
  const codeRef = useRef(null)

  const { status, deadline } = state
  const secondsLeft = status === 'sent' ? remainingSeconds(deadline, now) : 0
  const expired = status === 'sent' && secondsLeft === 0

  useEffect(() => {
    if (status !== 'sent') return undefined
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [status, deadline])

  async function send(email) {
    if (pending) return
    const trimmed = email.trim()
    if (!SCHOOL_EMAIL.test(trimmed)) {
      setState((current) => ({ ...current, errors: { email: trimmed ? SCHOOL_EMAIL_RULE : '이메일을 입력해 주세요.' } }))
      return
    }
    setPending('send')
    try {
      const { expiresInSeconds } = await sendEmailVerification(trimmed)
      const sentAt = Date.now()
      setNow(sentAt)
      setState({ status: 'sent', deadline: sentAt + expiresInSeconds * 1000, code: '', errors: {}, exhausted: false })
      // 입력칸은 이번 렌더에서 처음 나타날 수 있으므로 다음 프레임에 포커스한다.
      requestAnimationFrame(() => codeRef.current?.focus())
    } catch (error) {
      setState((current) => ({ ...current, errors: sendCodeErrorsFrom(error) }))
    } finally {
      setPending(null)
    }
  }

  async function confirm(email) {
    if (pending || status !== 'sent') return
    if (expired) {
      setState((current) => ({ ...current, errors: { code: CODE_EXPIRED }, exhausted: true }))
      return
    }
    if (!VERIFICATION_CODE.test(state.code)) {
      setState((current) => ({ ...current, errors: { code: CODE_FORMAT } }))
      codeRef.current?.focus()
      return
    }
    setPending('verify')
    try {
      await verifyEmail({ email, code: state.code })
      setState((current) => ({ ...current, status: 'verified', errors: {} }))
    } catch (error) {
      const { exhausted = false, ...errors } = verifyCodeErrorsFrom(error)
      setState((current) => ({ ...current, errors, exhausted: current.exhausted || exhausted }))
      codeRef.current?.focus()
    } finally {
      setPending(null)
    }
  }

  // 숫자만 6자리까지 받는다. 재전송해야 하는 안내는 입력해도 지우지 않는다.
  function changeCode(value) {
    const code = value.replace(/\D/g, '').slice(0, 6)
    setState((current) => ({ ...current, code, errors: current.exhausted ? current.errors : {} }))
  }

  // 이메일이 바뀌었거나 가입 요청에서 인증이 만료됐다고 오면 처음부터 다시 인증한다.
  function reset() {
    setState(IDLE)
  }

  return {
    status,
    code: state.code,
    errors: expired && !state.errors.code ? { ...state.errors, code: CODE_EXPIRED } : state.errors,
    secondsLeft,
    canConfirm: status === 'sent' && !expired && !state.exhausted && pending === null,
    sending: pending === 'send',
    verifying: pending === 'verify',
    codeRef,
    send,
    confirm,
    changeCode,
    reset,
  }
}
