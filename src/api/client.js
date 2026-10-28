// 개발 서버에서는 Vite 프록시를 거쳐 같은 출처로 요청하므로 비워 둔다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

// 서버 오류 응답 { code, message, errors: [{ field, reason }] }를 담는다.
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message ?? `요청이 실패했습니다. (${status})`)
    this.name = 'ApiError'
    this.status = status
    this.code = body?.code
    this.fieldErrors = body?.errors ?? []
  }
}

function parseJson(text) {
  try {
    return text ? JSON.parse(text) : null
  } catch {
    return null
  }
}

export async function request(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    // 세션 쿠키(JSESSIONID)로 로그인 상태를 유지한다.
    credentials: 'include',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = parseJson(await response.text())
  if (!response.ok) throw new ApiError(response.status, data)
  return data
}
