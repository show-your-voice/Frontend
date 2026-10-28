# Show Your Voice

Frontend foundation for Show Your Voice, built with Vite, React, JavaScript, and styled-components.

## Scripts

- `npm run dev` starts the Vite development server.
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

## Stack

- Vite
- React
- styled-components
- ESLint

## 불편 신고 작성 미리보기

개발 서버에서 `/reports/new`를 열면 사진 첨부를 포함한 불편 신고 작성 화면을
확인할 수 있습니다. `ReportForm`은 `rooms`(실 검색 목록, 기본값은 예시 데이터)를 받고,
검증을 통과하면 `onSubmit`으로 선택한 실 id를 포함한 입력값과 첨부 사진 `File` 배열을
넘깁니다. 실제 업로드·등록 API와는 아직 연결하지 않았습니다.

## 작업 흐름

모든 작업은 **이슈 → 해당 이슈의 작업 브랜치 → 구현·검증 → PR** 순서로 진행합니다.

1. 파일 수정 전에 GitHub 이슈에서 작업 범위를 확인합니다. 관련 이슈가 없으면 먼저 등록합니다.
2. `git status --short --branch`와 `git branch --show-current`로 현재 상태를 확인합니다.
3. 브랜치 이름의 이슈 번호와 실제 작업 이슈가 일치하는지 확인합니다. 다른 작업의 브랜치에서는 구현을 시작하지 않습니다.
4. 브랜치가 없으면 최신 `origin/main`에서 `{type}/{이슈번호}-{설명}` 형식으로 만들고 전환합니다. 예: `feature/2-report-list-publishing`.
5. `npm run lint`, `npm run build`, 관련 테스트와 브라우저 확인을 마칩니다.
6. `main`을 대상으로 PR을 만들고 본문에 `Closes #이슈번호`를 적습니다. 팀원 승인 후 병합합니다.

세부 규칙은 [AGENTS.md](./AGENTS.md)의 ‘Git’ 항목을 따릅니다. 에이전트의 commit·push·PR 생성은 사용자가 요청했을 때 진행합니다.
