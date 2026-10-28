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

export function fetchMe() {
  return request('/api/users/me')
}
