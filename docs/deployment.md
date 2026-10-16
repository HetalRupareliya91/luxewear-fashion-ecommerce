# Deployment

## Settings
| Name | Where | Notes |
| --- | --- | --- |
| `DATABASE_URL` | backend | PostgreSQL connection string |
| `JWT_SECRET` | backend | 32+ random characters in production |
| `PAYMENT_WEBHOOK_SECRET` | backend | 32+ random characters in production |
| `FRONTEND_URL` | backend | Exact storefront origin, used for CORS with cookies |
| `COOKIE_SAMESITE` | backend | `lax` when storefront and API share a site, `none` (HTTPS only) otherwise |
| `NEXT_PUBLIC_API_URL` | frontend | Public URL of the API |
| `NEXT_PUBLIC_ADMIN_URL` | frontend | Optional; shows an Admin link to admins |

Generate a secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

## First deploy
```bash
cd backend
npm ci
npx prisma migrate deploy      # apply migrations
npm run db:seed                # optional sample catalogue and coupons
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='Str0ng-pass-123' npm run admin:create
npm run build && npm start
```
After pulling a version that changes `prisma/schema.prisma`, create a migration in development first with `npm run prisma:migrate`, commit the generated folder, then run `prisma migrate deploy` on the server.

## Docker
`backend/Dockerfile` builds a small production image (compile in one stage, run as the unprivileged `node` user):
```bash
docker build -t luxewear-api backend
docker run -p 5000:5000 --env-file backend/.env luxewear-api
```

## Checklist
- HTTPS on both sites; cookies are `Secure` automatically in production.
- Webhook URL registered with the payment company, using the same secret.
- Database backups switched on.
- The in-memory rate limiter is per server instance; use a shared store (Redis) if you run several.
