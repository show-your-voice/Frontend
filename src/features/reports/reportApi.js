import { apiUrl, request } from '../../api/client.js'

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
    location: [report.place?.name, report.room?.name].filter(Boolean).join(' · '),
    placeId: report.place?.id,
    roomId: report.room?.id,
    author: report.author?.name ?? '',
    authorDisplay: toAuthorDisplay(report.author),
    canChangeStatus: report.canChangeStatus === true,
    primaryAssigneeId: report.assignee?.id ?? null,
    manager: report.assignee?.name ?? '',
    coAssignees: (report.coAssignees ?? []).map((manager) => ({
      id: manager.id,
      name: manager.name,
      email: manager.email,
    })),
    status: toReportStatus(report.status),
    date: report.receivedAt?.slice(0, 10) ?? '',
    startedAt: report.inProgressAt?.slice(0, 10) ?? '',
    completedAt: report.resolvedAt?.slice(0, 10) ?? '',
    photos: (report.imageUrls ?? []).map((src, index) => ({
      id: `${report.id}-${index}`,
      src: apiUrl(src),
      alt: `${report.title} 첨부 사진 ${index + 1}`,
    })),
  }
}

export async function fetchManagerReports({ assignedOnly }) {
  const reports = await request(assignedOnly ? '/api/posts/assigned' : '/api/posts')
  return reports.map(toReportCard)
}

export async function fetchReportDetail(reportId) {
  const report = await request(`/api/posts/${encodeURIComponent(reportId)}`)
  return toReportDetail(report)
}

const categoryCodes = {
  '시설 고장': 'FACILITY',
  네트워크: 'NETWORK',
  청소: 'ENVIRONMENT',
  기타: 'ETC',
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

export async function createReport({ room, category, title, content, improvement, photos }) {
  const [position, imageUrls] = await Promise.all([
    fetchRoomCenter(room),
    Promise.all(photos.map((photo) => {
      const body = new FormData()
      body.append('file', photo)
      return request('/api/images/posts', { method: 'POST', body }).then((image) => image.imageUrl)
    })),
  ])

  return request('/api/posts', {
    method: 'POST',
    body: { title, content, category: categoryCodes[category], roomId: room.id, ...position, improvement, imageUrls },
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
