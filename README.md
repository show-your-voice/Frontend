# Show Your Voice

Frontend foundation for Show Your Voice, built with Vite, React, JavaScript, and styled-components.

## Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production build in `dist`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint.
- `npm run react:doctor` runs the React Doctor scan.

## Stack

- Vite
- React
- styled-components
- ESLint

## 작업 흐름

모든 작업은 **이슈 → 해당 이슈의 작업 브랜치 → 구현·검증 → PR** 순서로 진행합니다.

1. 파일 수정 전에 GitHub 이슈에서 작업 범위를 확인합니다. 관련 이슈가 없으면 먼저 등록합니다.
2. `git status --short --branch`와 `git branch --show-current`로 현재 상태를 확인합니다.
3. 브랜치 이름의 이슈 번호와 실제 작업 이슈가 일치하는지 확인합니다. 다른 작업의 브랜치에서는 구현을 시작하지 않습니다.
4. 브랜치가 없으면 최신 `origin/main`에서 `{type}/{이슈번호}-{설명}` 형식으로 만들고 전환합니다. 예: `feature/2-report-list-publishing`.
5. `npm run lint`, `npm run build`, 관련 테스트와 브라우저 확인을 마칩니다.
6. `main`을 대상으로 PR을 만들고 본문에 `Closes #이슈번호`를 적습니다. 팀원 승인 후 병합합니다.

세부 규칙은 [AGENTS.md](./AGENTS.md)의 ‘Git’ 항목을 따릅니다. 에이전트의 commit·push·PR 생성은 사용자가 요청했을 때 진행합니다.
