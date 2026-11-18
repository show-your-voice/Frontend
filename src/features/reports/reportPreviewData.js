// 교내 지도 화면에서 사용하는 게시글 엔티티 형태의 예시 데이터다.
export const mapReportPreviewData = [
  { id: 1, room_id: 1, title: '화장실 세면대 물이 안 나와요', content: '2번째 세면대 수도꼭지를 돌려도 물이 나오지 않습니다.', status: 'IN_PROGRESS', created_at: '2026-10-12T09:00:00', author_name: '김학생' },
  { id: 2, room_id: 1, title: '화장실 칸 잠금장치 고장', content: '3번째 칸 문이 잠기지 않아요.', status: 'IN_PROGRESS', created_at: '2026-10-11T09:00:00', author_name: '박학생' },
  { id: 3, room_id: 2, title: '임베디드1실 프로젝터 화면 깜빡임', content: '수업 중 프로젝터 화면이 계속 깜빡여서 보기 어렵습니다.', status: 'UNRESOLVED', created_at: '2026-10-10T09:00:00', author_name: '최학생' },
  { id: 4, room_id: 3, title: '1-2반 의자 다리 흔들림', content: '뒷줄 의자 다리가 흔들려서 앉기 불안합니다.', status: 'UNRESOLVED', created_at: '2026-10-09T09:00:00', author_name: '정학생' },
  { id: 5, room_id: 4, title: '독서실 형광등 교체 요청', content: '창가 쪽 형광등 하나가 꺼져 있어요.', status: 'RESOLVED', created_at: '2026-10-02T09:00:00', author_name: '한학생' },
]
