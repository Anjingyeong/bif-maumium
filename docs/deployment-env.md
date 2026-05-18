# Deployment Environment Variables

## Render Backend

Set these variables on the Render service that runs the Express backend.

- `DATABASE_URL`: PostgreSQL connection string used by Prisma.
- `ADMIN_TOKEN`: Secret token for administrator-only result APIs. Send it as `Authorization: Bearer <token>` or `X-Admin-Token`.
- `FRONTEND_ORIGIN`: Allowed frontend origin for CORS, for example `https://maumium.kr` or a Vercel URL. Use a comma-separated list only when multiple explicit origins are needed.

Backend result APIs:

- `POST /api/results`: Save a consented screening result.
- `GET /api/results/:id`: Fetch one result by UUID.
- `GET /api/admin/results`: List recent results. Requires `ADMIN_TOKEN`.
- `DELETE /api/admin/results/:id`: Delete a result by UUID. Requires `ADMIN_TOKEN`.

## Vercel Frontend

Set this variable on the Vercel project that runs the Vite frontend.

- `VITE_API_BASE_URL`: Render backend base URL, for example `https://your-service.onrender.com`.

## Data Minimization

The result save flow only asks for an anonymous nickname. Do not collect or enter real names, phone numbers, email addresses, resident registration numbers, or other directly identifying information. The screening remains a self-check tool for preliminary guidance and does not replace standardized professional assessment.
