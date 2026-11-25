# Show Your Voice

Frontend foundation for Show Your Voice, built with Vite, React, JavaScript, and styled-components.

## Scripts

- `npm run dev` starts the Vite development server on `http://localhost:3000`.
  `/api` requests are proxied to the backend at `http://localhost:8080`.
  Port 3000 is fixed because the backend CORS allows only `localhost:3000` and `3001`.
- `npm run build` creates the production build in `dist`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint.

## 담당자 정보 미리보기

개발 서버에서 `/managers`를 열면 전역 헤더를 제외한 담당자 정보 화면을
확인할 수 있습니다. `/`의 기존 신고 현황·목록·상세 미리보기도 유지합니다.

`ManagerInfoPage`는 `managers` 배열을 props로 받으며 `PageIntro`,
`ManagerTable`, `ManagerTableRow`, `ManagerLocations`, `LocationTag`를
조합합니다. 각 담당자의 표시 형식은 `{ id, name, email, locations }`이며
`locations`는 장소 문자열 배열입니다. `managerPreviewData.js`는 시안의
퍼블리싱 예시 데이터이며 실제 조회 API와는 별도로 관리합니다.

640px 이하에서는 이름·이메일 아래에 장소를 배치합니다. 빈 목록과 누락된
정보도 표시하며, 긴 이메일·장소는 화면 너비 안에서 줄바꿈합니다.

## 관리자 담당 신고 조회

개발 서버에서 `/manager/reports`를 열면 관리자 헤더와 신고 목록을 확인할 수
있습니다. 기본으로 체크된 ‘내 담당만 보기’는 `GET /api/posts/assigned`로 로그인한
선생님의 주 담당·공동 담당 신고를 표시합니다. 체크를 해제하면 `GET /api/posts`로
전체 신고를 조회합니다. 전체·접수·처리 중·처리 완료 필터는 선택한 조회 범위에
적용되며, 상세에서 목록으로 돌아올 때 조회 범위와 상태 필터가 유지됩니다.

목록 카드를 선택하면 `/manager/reports/:reportId`로 이동해
`GET /api/posts/{id}`의 신고 상세를 표시합니다. 기존 Student 상세 UI를 재사용하며
상태·처리 이력·신고 정보·첨부 사진·본문·개선 방향을 조회합니다.

상세의 ‘공동 담당자 추가’ 버튼은 `GET /api/managers`의 관리자를 검색하는 모달을
열고, 한 명을 선택하면 `POST /api/posts/{id}/co-assignees`로 추가합니다. 성공 응답으로
상세를 즉시 갱신하며 기존 담당자와 추가된 공동 담당자를 함께 표시합니다.

관리자 상세의 삭제 확인은 `DELETE /api/posts/{id}`를 호출합니다. 목록과 상세는
로딩·오류·다시 시도 상태를 제공합니다.

## Stack

- Vite
- React
- styled-components
- ESLint

## 불편 신고 작성 미리보기

개발 서버에서 `/reports/new`를 열면 사진 첨부를 포함한 불편 신고 작성 화면을
확인할 수 있습니다. `ReportForm`은 선택한 실 `room`과 지도에서 실을 다시 고르는 `onPickRoom`을 받고,
검증을 통과하면 `onSubmit`으로 입력값과 첨부 사진 `File` 배열을 넘깁니다.

## 게시물 삭제 미리보기

`/`에서 로그인 후 ‘전체 신고 목록 보기’ → 게시글 → ‘게시물 삭제’로 확인합니다.
공통 `Modal`과 신고 전용 `ReportDeleteModal`로 나누었으며, 취소 또는 Escape로
닫으면 삭제 버튼에 포커스가 돌아갑니다. 확인하면 미리보기 목록에서 해당 게시글을
제거하고 선택한 상태 필터를 유지한 채 목록으로 돌아갑니다. 실제 삭제 API는
연결하지 않았으며 새로고침하면 예시 데이터가 복원됩니다.

## 작업 흐름

모든 작업은 **이슈 → 해당 이슈의 작업 브랜치 → 구현·검증 → PR** 순서로 진행합니다.

1. 파일 수정 전에 GitHub 이슈에서 작업 범위를 확인합니다. 관련 이슈가 없으면 먼저 등록합니다.
2. `git status --short --branch`와 `git branch --show-current`로 현재 상태를 확인합니다.
3. 브랜치 이름의 이슈 번호와 실제 작업 이슈가 일치하는지 확인합니다. 다른 작업의 브랜치에서는 구현을 시작하지 않습니다.
4. 브랜치가 없으면 최신 `origin/main`에서 `{type}/{이슈번호}-{설명}` 형식으로 만들고 전환합니다. 예: `feature/2-report-list-publishing`.
5. `npm run lint`, `npm run build`, 관련 테스트와 브라우저 확인을 마칩니다.
6. `main`을 대상으로 PR을 만들고 본문에 `Closes #이슈번호`를 적습니다. 팀원 승인 후 병합합니다.

세부 규칙은 [AGENTS.md](./AGENTS.md)의 ‘Git’ 항목을 따릅니다. 에이전트의 commit·push·PR 생성은 사용자가 요청했을 때 진행합니다.
