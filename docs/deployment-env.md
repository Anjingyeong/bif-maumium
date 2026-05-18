# Deployment Environment Variables

## Cloudflare Pages

Use Cloudflare Pages for the Vite/React frontend.

- Build command: `corepack pnpm build:pages`
- Build output directory: `dist/public`
- `VITE_API_BASE_URL`: Optional Worker API base URL. Leave empty when Pages routes `/api/*` to the Worker on the same domain. Set it only when the API is on another explicit origin.

Pages routing:

- `client/public/_redirects` keeps React client-side routes working with `/* /index.html 200`.
- Connect the Worker to `/api/*` using a Pages Functions/Workers route or Cloudflare dashboard route for the deployed domain.

## Cloudflare Workers + D1

Use `workers/api` for the result storage API and D1 for persistence.

- `FRONTEND_ORIGIN`: Allowed frontend origin for CORS, for example `https://maumium.kr`. Use a comma-separated list only when multiple explicit origins are needed.
- `ADMIN_TOKEN`: Worker secret for administrator-only result APIs. Set with `wrangler secret put ADMIN_TOKEN --config workers/api/wrangler.toml`.
- `DB`: D1 binding named `DB`, configured in `workers/api/wrangler.toml`.

Setup flow:

1. Create the D1 database: `wrangler d1 create bif_maumium_results`
2. Copy the returned `database_id` into `workers/api/wrangler.toml`.
3. Apply migrations: `corepack pnpm d1:migrate:remote`
4. Deploy the Worker: `corepack pnpm worker:deploy`

Worker result APIs:

- `POST /api/results`: Save a consented screening result with `nickname`, `answers`, `domainScores`, `totalScore`, `riskLevel`, `consentAgreed`, and `createdAt`.
- `GET /api/results/:id`: Fetch one result by UUID.
- `GET /api/admin/results`: List recent result summaries. Requires `Authorization: Bearer <ADMIN_TOKEN>`.
- `DELETE /api/admin/results/:id`: Delete a result by UUID. Requires `Authorization: Bearer <ADMIN_TOKEN>`.

## Legacy Render/Vercel Notes

The previous Express/Prisma backend can still use these variables if that deployment path is kept around:

- Render backend: `DATABASE_URL`, `ADMIN_TOKEN`, `FRONTEND_ORIGIN`
- Vercel frontend: `VITE_API_BASE_URL`

## Data Minimization

The result save flow only asks for an anonymous nickname. Do not collect or enter real names, phone numbers, email addresses, resident registration numbers, or other directly identifying information. If a user does not consent to result storage, the frontend does not call the Worker API. The screening remains a self-check tool for preliminary guidance and does not replace standardized professional assessment.
