# Architecture

## Backend layers
Every feature in `backend/src/modules/<feature>` follows the same shape:

| File | Job |
| --- | --- |
| `*.types.ts` | The storage contract (`Repository`) and the data types |
| `*.service.ts` | Business rules; knows nothing about HTTP or the database |
| `*.router.ts` | Express routes: validate input, call the service, send JSON |
| `*.repository.ts` | The Prisma implementation of the contract |
| `*.routes.ts` | Wires the real repository and settings into the router |

Validation lives in `src/validators`, small pure functions that return `{ ok, value }` or `{ ok: false, errors }`.

## Why services take their storage as a parameter
`createOrderService({ orders, coupons })` receives the repository instead of importing Prisma. In tests an in-memory repository (`tests/helpers/memory*.ts`) is passed instead, so the whole HTTP flow runs against a real Express server without a database, in milliseconds. In production `*.routes.ts` passes the Prisma version.

## Rules that matter
- **Money is whole cents** everywhere in the API (products are the exception: the catalogue keeps dollars).
- **The server prices everything.** Clients send SKUs and quantities only.
- **Stock changes inside the order transaction** with a `stock >= quantity` condition, so two buyers cannot take the last item.
- **Errors are `AppError`** with a status code; the error handler turns them into `{ success: false, message, details }`.
- **Roles**: `requireAuth(secret)` reads the login cookie or Bearer token, `requireRole("ADMIN")` guards admin routes.

## Frontend
Next.js App Router. Catalogue, cart and wishlist are still browser-side; account, sign-in and orders talk to the API through `src/services`. `AuthContext` holds the signed-in user, `RequireAuth` guards account pages.
