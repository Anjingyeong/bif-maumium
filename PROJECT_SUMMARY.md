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

## Cloudflare Flow

- Cloudflare Pages builds the Vite frontend with `pnpm build:pages`.
- Pages output is `dist/public`; `client/public/_redirects` preserves client-side routes.
- Remote saving can use same-origin `/api/results` on Cloudflare, or `VITE_API_BASE_URL` when the Worker is deployed on a separate origin.
- Cloudflare Worker code lives in `workers/api`.
- D1 migrations live in `workers/api/migrations`.
- `workers/api/wrangler.toml` documents the Worker, D1 binding, and `FRONTEND_ORIGIN` setup.

## Backend Flow

- Express starts in `server/_core/index.ts`.
- REST result APIs are registered from `server/resultsApi.ts`.
- Prisma is used for PostgreSQL persistence with the schema in `prisma/schema.prisma`.
- Stored fields are minimized to nickname, test type, answers, domain scores, total score, max score, risk level/title, consent flag, and created timestamp.
- Result IDs are UUIDs so lookup URLs are not sequential or easily guessable.
- Admin APIs are protected with `ADMIN_TOKEN`.
- CORS is restricted to `FRONTEND_ORIGIN` plus explicit local development origins outside production.

The Cloudflare Worker provides the same result API surface with D1 instead of PostgreSQL/Prisma. `ADMIN_TOKEN` is a Worker secret only.

## APIs

- `POST /api/results`: Save a consented screening result with `nickname`, `answers`, `domainScores`, `totalScore`, `riskLevel`, `consentAgreed`, and `createdAt`.
- `GET /api/results/:id`: Fetch one result by UUID.
- `GET /api/admin/results`: Admin list endpoint, requires `ADMIN_TOKEN`.
- `DELETE /api/admin/results/:id`: Admin delete endpoint, requires `ADMIN_TOKEN`.

## Deployment Environment Variables

Cloudflare Pages:

- `VITE_API_BASE_URL` (optional when using same-origin `/api`)

Cloudflare Worker:

- `ADMIN_TOKEN` (secret)
- `FRONTEND_ORIGIN`
- `DB` D1 binding

Legacy Render backend:

- `DATABASE_URL`
- `ADMIN_TOKEN`
- `FRONTEND_ORIGIN`

Legacy Vercel frontend:

- `VITE_API_BASE_URL`

More detail is in `docs/deployment-env.md`.

## Validation Commands

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build:pages`
- `pnpm typecheck:worker`
- `pnpm test`
- `pnpm db:push`

## 2026-05-18 Operations Bugfix Notes

- Test entry links now include a fresh run key, and adult/child test pages reset question index, answers, direction, nickname, and save consent whenever a new run starts.
- The result page's "test again" action starts a fresh run from the first question instead of reusing prior in-memory state.
- Consent switch accessibility was tightened with an explicit button type, switch label, and synced `aria-checked` state.
- The homepage terminology banner keeps its existing design while improving mobile wrapping, width constraints, and overflow handling.
- KakaoTalk sharing UI and SDK helper code were removed; the general link copy action remains.
- PDF export continues to use canvas-rendered Korean text through jsPDF, now waiting for Korean-capable fonts before rendering and using a Hangul-safe font fallback stack.

## 2026-05-18 Landing Page Polish Notes

- The homepage hero keeps the existing image and brand mood, but now uses a stronger left-side readability overlay, slightly bolder headline weight, and tighter text width.
- Top navigation links use higher contrast, clearer active state, and focus-visible rings.
- The yellow terminology notice is visually calmer so the main hero message remains primary.
- Main and final CTA pairs are balanced with filled adult/child buttons using primary and accent tones.
- The email interest widget accurately reflects the current implementation: emails are saved only in this browser's localStorage and are not sent to a server.

## 2026-05-18 Icon Asset Notes

- Replaced missing Manus favicon references with generated Maumium icon assets under `client/public/icons/`.
- Added `site.webmanifest` and reused the new icon for the homepage navigation logo and adult test header icon.

## 2026-05-18 Email & Partnership Section Notes

- The homepage email area now clearly describes open/update interest storage instead of mixing it with partnership inquiries.
- Partnership/contact inquiries are separated into a mailto-based card using `maumium.service@gmail.com`.
- The email widget copy matches the current implementation: emails are stored only in this browser's localStorage and are not sent to a server or DB.
