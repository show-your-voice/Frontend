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

export function validateReport({ room, category, title, content, improvement = '' }) {
  const errors = {}
  if (!room) errors.room = '실을 선택해 주세요.'
  if (!category) errors.category = '카테고리를 선택해 주세요.'
  if (!title.trim()) errors.title = '제목을 입력해 주세요.'
  else if (title.length > 100) errors.title = '제목은 100자까지 입력할 수 있어요.'
  if (!content.trim()) errors.content = '본문을 입력해 주세요.'
  else if (content.length > 5000) errors.content = '본문은 5000자까지 입력할 수 있어요.'
  if (improvement.length > 1000) errors.improvement = '개선 방향은 1000자까지 입력할 수 있어요.'
  return errors
}
