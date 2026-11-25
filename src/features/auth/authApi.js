import { request } from '../../api/client.js'

export function login({ loginId, password }) {
  return request('/api/auth/login', { method: 'POST', body: { loginId, password } })
}

export function signUp({ loginId, email, name, password }) {
  return request('/api/auth/signup', {
    method: 'POST',
    body: { loginId, email: email.trim(), name: name.trim(), password },
  })
}

// 재전송도 같은 요청이다. 응답 { expiresAt, expiresInSeconds, remainingAttempts }
export function sendEmailVerification(email) {
  return request('/api/auth/email-verifications', { method: 'POST', body: { email: email.trim() } })
}

export function verifyEmail({ email, code }) {
  return request('/api/auth/email-verifications/verify', {
    method: 'POST',
    body: { email: email.trim(), code },
  })
}

export function logout() {
  return request('/api/auth/logout', { method: 'POST' })
}

export function fetchSession() {
  return request('/api/users/me/session')
}
