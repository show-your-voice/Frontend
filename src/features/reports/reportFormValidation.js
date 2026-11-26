export const REPORT_CATEGORY_CODES = {
  '시설 고장': 'FACILITY',
  네트워크: 'NETWORK',
  청소: 'ENVIRONMENT',
  기타: 'ETC',
}

export const REPORT_CATEGORIES = Object.keys(REPORT_CATEGORY_CODES)

export const MAX_REPORT_PHOTOS = 5

export const REPORT_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const MAX_REPORT_PHOTO_SIZE = 5 * 1024 * 1024

export const REPORT_TEXT_LIMITS = { title: 100, content: 5000, improvement: 1000 }

export function validateReport({ room, category, title, content, improvement = '' }) {
  const errors = {}
  if (!room) errors.room = '실을 선택해 주세요.'
  if (!category) errors.category = '카테고리를 선택해 주세요.'
  if (!title.trim()) errors.title = '제목을 입력해 주세요.'
  else if (title.length > REPORT_TEXT_LIMITS.title) errors.title = `제목은 ${REPORT_TEXT_LIMITS.title}자까지 입력할 수 있어요.`
  if (!content.trim()) errors.content = '본문을 입력해 주세요.'
  else if (content.length > REPORT_TEXT_LIMITS.content) errors.content = `본문은 ${REPORT_TEXT_LIMITS.content.toLocaleString()}자까지 입력할 수 있어요.`
  if (improvement.length > REPORT_TEXT_LIMITS.improvement) errors.improvement = `개선 방향은 ${REPORT_TEXT_LIMITS.improvement.toLocaleString()}자까지 입력할 수 있어요.`
  return errors
}

const serverFieldNames = { title: 'title', content: 'content', improvement: 'improvement', category: 'category', roomId: 'room' }

export function toReportFieldErrors(fieldErrors = []) {
  const fields = {}
  const others = []
  for (const { field = '', reason } of fieldErrors) {
    const name = serverFieldNames[field] ?? (field.startsWith('imageUrls') ? 'photos' : null)
    if (!name) others.push(reason)
    else if (!fields[name]) fields[name] = reason
  }
  return { fields, others }
}
