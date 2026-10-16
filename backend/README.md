# LuxeWear Backend

Modular Express 5 + TypeScript API with Prisma/PostgreSQL.

## Scripts
| Script | What it does |
| --- | --- |
| `npm run dev` | Start the API with auto reload (http://localhost:5000) |
| `npm run build` / `npm start` | Compile to `dist/` and run it |
| `npm test` | Run the unit tests (Node test runner + tsx, no extra packages) |
| `npm run typecheck` | Type check `src/`, `tests/` and `scripts/` |
| `npm run admin:create` | Create or promote an admin (needs `ADMIN_EMAIL` and `ADMIN_PASSWORD`) |
| `npm run prisma:generate` | Generate the Prisma client |
| `npm run prisma:migrate` | Create/apply a migration in development |
| `npm run db:seed` | Add the sample catalogue and two coupons (safe to repeat) |
| `npm run admin:create` | Create or promote an admin (see docs/auth.md) |

## Structure
```
src/
  config/       env parsing and the Prisma client
  errors/       AppError (HTTP aware errors)
  middleware/   errorHandler, notFound, requestId, rateLimit, auth, validateBody
  validators/   input validation (primitives + auth payloads)
  utils/        money (integer cents), slug, pagination, apiResponse
  modules/      one folder per feature
    auth/       sign-up, sign-in, cookie sessions, password hashing (scrypt), signed tokens
    products/   catalog API and query parsing
    cart/       cart totals
    coupons/    coupon rules, service and /api/coupons
    shipping/   shipping costs
    tax/        tax calculation
    orders/     pricing, order placement and cancellation, status flow, order numbers
    payments/   provider contract, signed webhook
    wishlist/   saved products
    users/      admin user management
    inventory/  stock reservation
    reviews/    verified-buyer reviews and rating summaries
    analytics/  revenue and best-seller summaries
tests/          *.test.ts, one per module
```

## Conventions
- Money is always integer cents (`utils/money.ts`). Convert at the edges only.
- Business rules live in small pure functions with unit tests; routes and controllers stay thin.
- Errors: throw `AppError.*`; `errorHandler` turns them into `{ success: false, message }`.
- Success responses look like `{ success: true, data, meta? }`.
