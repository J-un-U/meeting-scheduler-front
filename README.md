# Meeting Scheduler Front

회의 일정 조율을 위한 프론트엔드 UI 프로젝트입니다. 로그인 화면과 대시보드 레이아웃을 기반으로 약속 생성 흐름을 확장해 나가는 구조입니다.

## 주요 기능
- 로그인 화면(`/`)
- 대시보드 레이아웃(`/dashboard`)
- 약속 만들기 모달 UI

## 기술 스택
- Next.js (App Router)
- React 19
- TypeScript
- Tailwind CSS
- React Query
- Headless UI

## 개발 환경
- Node.js 22.16.0
- pnpm 10.28.0

## 시작하기
```bash
pnpm install
pnpm dev
```

## 스크립트
```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## 환경 변수
현재 필수 환경 변수는 없습니다. 추후 API 연동 시 `.env.local`을 사용합니다.

예시:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 폴더 구조
```
app/
  (public)/
    page.tsx          # 로그인 화면
  (private)/
    dashboard/        # 대시보드
  components/
    layout/           # Header, Sidebar, Content
    Modal.tsx
```

## 참고
- `app/(public)`과 `app/(private)`로 공개/보호 화면을 구분합니다.
- 현재 로그인은 라우팅 데모 수준이며 실제 인증 로직은 연결되지 않았습니다.
