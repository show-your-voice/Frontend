// 첨부 시안의 퍼블리싱 확인용 예시이며 서버 API 응답 형식이 아니다.
export const reportOverviewPreviewData = {
  location: '청죽관 4층',
  statuses: [
    { tone: 'received', label: '접수', count: 4 },
    { tone: 'inProgress', label: '처리 중', count: 2 },
    { tone: 'completed', label: '처리 완료', count: 1 },
  ],
}

export const reportPreviewData = [
  {
    id: 'preview-1',
    title: '화장실 세면대 물이 안 나와요',
    description: '2번째 세면대 수도꼭지를 돌려도 물이 나오지 않습니다.',
    date: '2026-10-12',
    author: '김학생',
    location: '창의관 4층 · 화장실(남)',
    status: { tone: 'received', label: '접수' },
  },
  {
    id: 'preview-2',
    title: '화장실 칸 잠금장치 고장',
    description: '3번째 칸 문이 잠기지 않아요.',
    date: '2026-10-11',
    author: '박학생',
    location: '청죽관 1층 · 화장실(남)',
    status: { tone: 'inProgress', label: '처리 중' },
  },
  {
    id: 'preview-3',
    title: 'AI연구실 프로젝터 화면 깜빡임',
    description: '수업 중 프로젝터 화면이 계속 깜빡여서 보기 어렵습니다.',
    date: '2026-10-10',
    author: '최학생',
    location: '청죽관 1층 · AI연구실',
    status: { tone: 'received', label: '접수' },
  },
  {
    id: 'preview-4',
    title: '발명교육센터 의자 다리 흔들림',
    description: '뒷줄 의자 다리가 흔들려서 앉기 불안합니다.',
    date: '2026-10-09',
    author: '정학생',
    location: '청죽관 1층 · 발명교육센터',
    status: { tone: 'received', label: '접수' },
  },
  {
    id: 'preview-5',
    title: '새롬홀 형광등 교체 요청',
    description: '창가 쪽 형광등 하나가 꺼져 있어요.',
    date: '2026-10-02',
    author: '한학생',
    location: '청죽관 1층 · 새롬홀',
    status: { tone: 'completed', label: '처리 완료' },
  },
]

export const reportDetailPreviewData = {
  'preview-1': {
    category: '시설 고장',
    authorDisplay: '김학생 (student01)',
    manager: '이선생',
    completedAt: null,
    content: '2번째 세면대 수도꼭지를 돌려도 물이 나오지 않습니다. 쉬는 시간마다 줄이 길어져서 불편해요.',
    improvement: '수도꼭지를 교체해 주세요.',
    photos: [
      { id: 'preview-photo-1', src: null, alt: '화장실 세면대 첨부 사진 1' },
      { id: 'preview-photo-2', src: null, alt: '화장실 세면대 첨부 사진 2' },
    ],
  },
}
