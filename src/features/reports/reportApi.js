import { apiUrl, request } from '../../api/client.js'

const statusByCode = {
  UNRESOLVED: { tone: 'received', label: '접수' },
  IN_PROGRESS: { tone: 'inProgress', label: '처리 중' },
  RESOLVED: { tone: 'completed', label: '처리 완료' },
}

function toReportStatus(status) {
  const statusCode = status?.code ?? status

  return statusByCode[statusCode] ?? {
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
    author: report.author?.name ?? '',
    authorDisplay: toAuthorDisplay(report.author),
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

export function deleteReport(reportId) {
  return request(`/api/posts/${encodeURIComponent(reportId)}`, { method: 'DELETE' })
}
