# PROJECT_SUMMARY

## Project

- `bif-screening` is a Vite/React self-check site for borderline intellectual functioning screening.
- The app keeps the existing warm guidance UI, wouter routing, result page, local history, PDF export, and informational pages.
- The checklist is a screening self-check only. It is not a diagnosis tool and does not copy standardized test questions.

## Frontend Flow

- Adult and child tests live in `client/src/pages/AdultTest.tsx` and `client/src/pages/ChildTest.tsx`.
- Questions and result thresholds live in `client/src/lib/questions.ts`.
- Result rendering and local history saving live in `client/src/pages/Result.tsx`.
- Before result submission, users can opt in to server result storage.
- If storage is enabled, the user must enter an anonymous nickname and confirm consent.
- The UI warns users not to enter direct identifiers such as real names, phone numbers, email addresses, or resident registration numbers.
- Remote result saving uses `VITE_API_BASE_URL` through `client/src/lib/resultPersistence.ts`.

## Backend Flow

- Express starts in `server/_core/index.ts`.
- REST result APIs are registered from `server/resultsApi.ts`.
- Prisma is used for PostgreSQL persistence with the schema in `prisma/schema.prisma`.
- Stored fields are minimized to nickname, test type, answers, category scores, total score, max score, risk level/title, consent flag, and submitted timestamp.
- Result IDs are UUIDs so lookup URLs are not sequential or easily guessable.
- Admin APIs are protected with `ADMIN_TOKEN`.
- CORS is restricted to `FRONTEND_ORIGIN` plus explicit local development origins outside production.

## APIs

- `POST /api/results`: Save a consented screening result.
- `GET /api/results/:id`: Fetch one result by UUID.
- `GET /api/admin/results`: Admin list endpoint, requires `ADMIN_TOKEN`.
- `DELETE /api/admin/results/:id`: Admin delete endpoint, requires `ADMIN_TOKEN`.

## Deployment Environment Variables

Render backend:

- `DATABASE_URL`
- `ADMIN_TOKEN`
- `FRONTEND_ORIGIN`

Vercel frontend:

- `VITE_API_BASE_URL`

More detail is in `docs/deployment-env.md`.

## Validation Commands

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm test`
- `pnpm db:push`
