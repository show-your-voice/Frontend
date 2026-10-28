export const REPORT_CATEGORIES = ['시설 고장', '네트워크', '청소', '기타']

export const MAX_REPORT_PHOTOS = 5

export function validateReport({ category, title, content }) {
  const errors = {}
  if (!category) errors.category = '카테고리를 선택해 주세요.'
  if (!title.trim()) errors.title = '제목을 입력해 주세요.'
  if (!content.trim()) errors.content = '본문을 입력해 주세요.'
  return errors
}
