// 로그인 후 next로 돌아갈 곳을 정한다. 역할별로 허용한 앱 경로만 쓰고(쿼리는 유지), 나머지는 역할의 기본 화면으로 보낸다.
const EDIT_PATH = /^\/reports\/\d+\/edit\/?$/
const ROLE_PATHS = {
  TEACHER: { home: '/manager/reports', allowed: /^\/manager\/(?:reports(?:\/\d+(?:\/edit)?)?|map)\/?$/ },
  USER: { home: '/', allowed: /^\/(?:reports\/(?:new|\d+)\/?)?$/ },
}

export function loginRedirectPath(next, role) {
  if (next === '/managers') return next
  const [nextPath] = next.split('?')
  if (EDIT_PATH.test(nextPath)) return next
  const { home, allowed } = role === 'TEACHER' ? ROLE_PATHS.TEACHER : ROLE_PATHS.USER
  return allowed.test(nextPath) ? next : home
}
