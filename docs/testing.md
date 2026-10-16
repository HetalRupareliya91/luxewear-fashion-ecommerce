# Testing

```bash
cd backend
npm test            # every tests/**/*.test.ts with Node's built-in runner
npm run typecheck   # types for src, tests and scripts
```
No database is needed. HTTP tests start a real Express app on a random port (`tests/helpers/testServer.ts`) with in-memory repositories, then call it with `fetch`, the same way a browser would.

## Helpers
- `startServer(mount)` starts the app; `server.get/post/patch/put/del(path, body, headers)` call it.
- `asUser(id)` / `asAdmin(id)` give a signed `Authorization` header.
- `createMemoryUsers/Coupons/Orders/Reviews/Products` behave like the database, including unique keys and stock.

## What is covered
Validators, pricing rules, order creation and cancellation (including two buyers racing for the last item), payment webhooks (bad and repeated signatures), role checks on every admin route, ownership checks (a customer can never read another customer's order), and the sign-in session.

## What is not
The Prisma repositories talk to PostgreSQL and are not exercised here. After changing one, run the API against a development database and try the matching request from [the API reference](api.md).

## Storefront
`npm run lint` and `npm run build` in `frontend` check types and pages.
