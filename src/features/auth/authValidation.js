// 퍼블리싱용 클라이언트 검증이다. 서버 검증 규칙을 대신하지 않는다.
const SCHOOL_EMAIL = /^[A-Za-z0-9._%+-]+@dsm\.hs\.kr$/
const PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,50}$/

export const PASSWORD_RULE = '영문, 숫자, 특수문자 포함 8자 이상'
export const SCHOOL_EMAIL_RULE = '학교 이메일(@dsm.hs.kr)만 사용할 수 있어요.'

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
  if (!loginId.trim()) errors.loginId = '아이디를 입력해 주세요.'
  if (name.trim().length < 2) errors.name = '이름을 2자 이상 입력해 주세요.'
  if (!PASSWORD.test(password)) errors.password = PASSWORD_RULE
  if (!passwordConfirm) errors.passwordConfirm = '비밀번호를 한 번 더 입력해 주세요.'
  else if (passwordConfirm !== password) errors.passwordConfirm = '비밀번호가 일치하지 않아요.'
  return errors
}
