import { ApiError } from '../../api/client.js'

// 백엔드 검증 규칙(SignUpRequest)과 같게 맞춘다. 최종 판단은 서버가 한다.
export const SCHOOL_EMAIL = /^[A-Za-z0-9._%+-]+@dsm\.hs\.kr$/
export const VERIFICATION_CODE = /^\d{6}$/
const LOGIN_ID = /^[a-z0-9]{4,20}$/

export const LOGIN_ID_RULE = '영문 소문자와 숫자 4~20자'
export const PASSWORD_RULE = '8자 이상 50자 이하'
export const SCHOOL_EMAIL_RULE = '학교 이메일(@dsm.hs.kr)만 사용할 수 있어요.'
export const CODE_SENT = '인증번호를 보냈어요. 메일함을 확인해 주세요.'
export const CODE_RULE = '메일로 받은 6자리 숫자를 3분 안에 입력하세요.'
export const EMAIL_VERIFIED = '이메일 인증이 완료됐어요.'
export const CODE_FORMAT = '6자리 숫자를 입력해 주세요.'
export const CODE_EXPIRED = '인증번호가 만료됐어요. 인증번호를 다시 받아 주세요.'
export const ATTEMPTS_EXCEEDED = '입력 기회를 모두 사용했어요. 인증번호를 다시 받아 주세요.'
export const VERIFICATION_EXPIRED = '이메일 인증이 만료됐어요. 다시 인증해 주세요.'
const LOGIN_FAILED = '아이디 또는 비밀번호가 일치하지 않아요.'
const REQUEST_FAILED = '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.'

export function validateLogin({ loginId, password }) {
  const errors = {}
  if (!loginId.trim()) errors.loginId = '아이디를 입력해 주세요.'
  if (!password) errors.password = '비밀번호를 입력해 주세요.'
  return errors
}

export function validateSignup({ email, loginId, name, password, passwordConfirm }) {
  const errors = {}
  if (!email.trim()) errors.email = '이메일을 입력해 주세요.'
  else if (!SCHOOL_EMAIL.test(email.trim())) errors.email = SCHOOL_EMAIL_RULE
  if (!loginId) errors.loginId = '아이디를 입력해 주세요.'
  else if (!LOGIN_ID.test(loginId)) errors.loginId = LOGIN_ID_RULE
  if (name.trim().length < 2) errors.name = '이름을 2자 이상 입력해 주세요.'
  if (!password.trim()) errors.password = '비밀번호를 입력해 주세요.'
  else if (password.length < 8 || password.length > 50) errors.password = PASSWORD_RULE
  if (!passwordConfirm) errors.passwordConfirm = '비밀번호를 한 번 더 입력해 주세요.'
  else if (passwordConfirm !== password) errors.passwordConfirm = '비밀번호가 일치하지 않아요.'
  return errors
}

// 서버의 필드 오류(C001)를 화면의 입력 칸 오류로 옮긴다. 화면에 없는 필드만 오면 공통 오류로 보인다.
function fieldErrorsFrom(error, fields) {
  const errors = Object.fromEntries(
    error.fieldErrors.filter(({ field }) => fields.includes(field)).map(({ field, reason }) => [field, reason]),
  )
  return Object.keys(errors).length > 0 ? errors : { form: REQUEST_FAILED }
}

// failure는 두 칸을 모두 오류로 표시하고 비밀번호 아래에 메시지를 보이는 로그인 실패 상태다.
export function loginErrorsFrom(error) {
  if (!(error instanceof ApiError)) return { form: REQUEST_FAILED }
  if (error.code === 'A003') return { failure: LOGIN_FAILED }
  if (error.code === 'C001') return fieldErrorsFrom(error, ['loginId', 'password'])
  return { form: REQUEST_FAILED }
}

export function signupErrorsFrom(error) {
  if (!(error instanceof ApiError)) return { form: REQUEST_FAILED }
  if (error.code === 'U003') return { loginId: '이미 사용 중인 아이디예요.' }
  if (error.code === 'U001') return { email: '이미 사용 중인 이메일이에요.' }
  if (error.code === 'E005') return { email: VERIFICATION_EXPIRED }
  if (error.code === 'C001') return fieldErrorsFrom(error, ['loginId', 'email', 'name', 'password'])
  return { form: REQUEST_FAILED }
}

// 인증번호 발송 실패는 이메일 칸 오류로 보인다.
export function sendCodeErrorsFrom(error) {
  if (!(error instanceof ApiError)) return { form: REQUEST_FAILED }
  if (error.code === 'U001') return { email: '이미 사용 중인 이메일이에요.' }
  if (error.code === 'E006') return { email: '인증번호 메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.' }
  if (error.code === 'C001') return fieldErrorsFrom(error, ['email'])
  return { form: REQUEST_FAILED }
}

// exhausted는 재전송하기 전까지 확인을 막아야 하는 상태다(기회 소진·만료).
export function verifyCodeErrorsFrom(error) {
  if (!(error instanceof ApiError)) return { form: REQUEST_FAILED }
  if (error.code === 'E002') {
    if (error.remainingAttempts === 0) return { code: ATTEMPTS_EXCEEDED, exhausted: true }
    return { code: `인증번호가 일치하지 않아요. (남은 기회 ${error.remainingAttempts}번)` }
  }
  if (error.code === 'E004') return { code: ATTEMPTS_EXCEEDED, exhausted: true }
  if (error.code === 'E003') return { code: CODE_EXPIRED, exhausted: true }
  if (error.code === 'E001') return { code: '인증번호를 먼저 받아 주세요.', exhausted: true }
  if (error.code === 'C001') return { code: CODE_FORMAT }
  return { form: REQUEST_FAILED }
}
