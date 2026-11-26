import { apiUrl, request } from '../../api/client.js'
import { REPORT_CATEGORY_CODES } from './reportFormValidation.js'

export const reportStatuses = [
  { code: 'UNRESOLVED', tone: 'received', label: '접수' },
  { code: 'IN_PROGRESS', tone: 'inProgress', label: '처리 중' },
  { code: 'RESOLVED', tone: 'completed', label: '처리 완료' },
]

function toReportStatus(status) {
  const statusCode = status?.code ?? status

  return reportStatuses.find(({ code }) => code === statusCode) ?? {
    code: statusCode,
    tone: 'received',
    label: status?.label ?? '접수',
  }
}

function toReportCard(report) {
  return {
    id: report.id,
    placeName: report.placeName,
    roomId: report.roomId,
    title: report.title,
    description: report.content,
    date: report.receivedAt?.slice(0, 10) ?? '',
    author: report.authorName ?? '',
    location: [report.placeName, report.roomName].filter(Boolean).join(' · '),
    status: toReportStatus(report.status),
  }
}

function toAuthorDisplay(author) {
  if (!author) return ''
  return author.loginId ? `${author.name} (${author.loginId})` : author.name
}

function toReportDetail(report) {
  return {
    id: report.id,
    title: report.title,
    content: report.content,
    improvement: report.improvement,
    category: report.category?.label ?? '',
    categoryCode: report.category?.code,
    location: [report.place?.name, report.room?.name].filter(Boolean).join(' · '),
    placeId: report.place?.id,
    roomId: report.room?.id,
    posX: report.posX,
    posY: report.posY,
    author: report.author?.name ?? '',
    authorDisplay: toAuthorDisplay(report.author),
    canChangeStatus: report.canChangeStatus === true,
    canEdit: report.canEdit === true,
    primaryAssigneeId: report.assignee?.id ?? null,
    manager: report.assignee?.name ?? '',
    coAssignees: (report.coAssignees ?? []).map((manager) => ({
      id: manager.id,
      name: manager.name,
      email: manager.email,
    })),
    status: toReportStatus(report.status),
    date: report.receivedAt?.slice(0, 10) ?? '',
    receivedAt: report.receivedAt ?? '',
    startedAt: report.inProgressAt ?? '',
    completedAt: report.resolvedAt ?? '',
    photos: (report.imageUrls ?? []).map((src, index) => ({
      id: `${report.id}-${index}`,
      imageUrl: src,
      src: apiUrl(src),
      alt: `${report.title} 첨부 사진 ${index + 1}`,
    })),
  }
}

export const REPORT_PAGE_SIZE = 10
const ACTIVE_REPORTS_LIMIT = 2000

const statusCodesByTone = Object.fromEntries(reportStatuses.map(({ code, tone }) => [tone, code]))

function postsQuery({ placeId, roomId, status, page, size }) {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  if (placeId != null) params.set('placeId', placeId)
  if (roomId != null) params.set('roomId', roomId)
  if (status) params.set('status', status)
  return `/api/posts?${params}`
}

export async function fetchReportPage({ placeId, roomId, status, page = 0, size = REPORT_PAGE_SIZE }) {
  const data = await request(postsQuery({ placeId, roomId, status: statusCodesByTone[status], page, size }))
  if (!Array.isArray(data?.posts)) throw new Error('신고 목록 응답 형식이 올바르지 않습니다.')
  return { reports: data.posts.map(toReportCard), totalCount: data.totalCount, totalPages: data.totalPages }
}

export async function fetchActivePlaceReports(placeId) {
  const pages = await Promise.all(['UNRESOLVED', 'IN_PROGRESS'].map((status) => (
    request(postsQuery({ placeId, status, page: 0, size: ACTIVE_REPORTS_LIMIT }))
  )))
  if (!pages.every((data) => Array.isArray(data?.posts))) throw new Error('신고 목록 응답 형식이 올바르지 않습니다.')
  return pages.flatMap((data) => data.posts)
}

export function paginateReports(reports, page, size = REPORT_PAGE_SIZE) {
  const totalPages = Math.max(Math.ceil(reports.length / size), 1)
  const currentPage = Math.min(page, totalPages - 1)
  return {
    reports: reports.slice(currentPage * size, (currentPage + 1) * size),
    totalCount: reports.length,
    totalPages,
    page: currentPage,
  }
}

export async function fetchAssignedReports() {
  const reports = await request('/api/posts/assigned')
  return reports.map(toReportCard)
}

export async function fetchReportDetail(reportId) {
  const report = await request(`/api/posts/${encodeURIComponent(reportId)}`)
  return toReportDetail(report)
}

export function fetchRooms() {
  return request('/api/rooms')
}

async function fetchRoomCenter(room) {
  const floorPlan = await request(`/api/places/${room.placeId}/floor-plan`).catch(() => null)
  const cells = floorPlan?.rooms?.find((planRoom) => planRoom.id === room.id)?.cells ?? []
  if (!cells.length || !floorPlan.gridRows || !floorPlan.gridCols) return { posX: 0.5, posY: 0.5 }

  const average = (key) => cells.reduce((sum, cell) => sum + cell[key] + 0.5, 0) / cells.length
  const round = (value) => Math.round(Math.min(Math.max(value, 0), 1) * 10000) / 10000
  return { posX: round(average('gridCol') / floorPlan.gridCols), posY: round(average('gridRow') / floorPlan.gridRows) }
}

async function uploadReportPhoto(photo) {
  if (typeof photo === 'string') return photo
  const body = new FormData()
  body.append('file', photo)
  const image = await request('/api/images/posts', { method: 'POST', body })
  return image.imageUrl
}

async function buildPostBody({ room, category, title, content, improvement, photos }, initialReport) {
  const [position, imageUrls] = await Promise.all([
    initialReport?.roomId === room.id
      ? { posX: initialReport.posX, posY: initialReport.posY }
      : fetchRoomCenter(room),
    Promise.all(photos.map(uploadReportPhoto)),
  ])

  return { title, content, category: REPORT_CATEGORY_CODES[category], roomId: room.id, ...position, improvement, imageUrls }
}

export async function createReport(values) {
  return request('/api/posts', { method: 'POST', body: await buildPostBody(values) })
}

export async function updateReport(reportId, values, initialReport) {
  return request(`/api/posts/${encodeURIComponent(reportId)}`, {
    method: 'PUT',
    body: await buildPostBody(values, initialReport),
  })
}

export async function fetchManagers() {
  const managers = await request('/api/managers')
  if (!Array.isArray(managers)) throw new Error('담당자 목록 응답 형식이 올바르지 않습니다.')
  return managers
}

export async function addReportCoAssignee(reportId, managerId) {
  const report = await request(`/api/posts/${encodeURIComponent(reportId)}/co-assignees`, {
    method: 'POST',
    body: { managerId },
  })
  return toReportDetail(report)
}

export async function changeReportStatus(reportId, status) {
  const report = await request(`/api/posts/${encodeURIComponent(reportId)}/status`, {
    method: 'PATCH',
    body: { status },
  })
  return toReportDetail(report)
}

export function deleteReport(reportId) {
  return request(`/api/posts/${encodeURIComponent(reportId)}`, { method: 'DELETE' })
}
