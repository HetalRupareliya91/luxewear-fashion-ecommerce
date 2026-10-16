# Authentication

## How sign-in works
1. `POST /api/auth/register` or `/login` checks the input, then the API sets an **HttpOnly cookie** named `lw_token`.
2. The browser sends the cookie automatically (the storefront calls the API with `credentials: "include"`). JavaScript on the page can never read the token, which limits the damage of a script-injection bug.
3. `GET /api/auth/me` tells the storefront who is signed in. `POST /api/auth/logout` clears the cookie.
4. API clients that are not browsers can send `Authorization: Bearer <token>`; the header wins over the cookie.

## Safeguards
- Passwords are hashed with scrypt and a random salt (`modules/auth/password.ts`); the hash is never returned.
- Wrong password and unknown email both answer `401 Invalid email or password`, and an unknown email still performs a hash comparison so response time does not reveal which accounts exist.
- Register and login allow 10 attempts per minute per IP.
- Registration always creates a customer; a `role` in the request is ignored. Admins are created on the server with `npm run admin:create`.
- Tokens are signed (HMAC-SHA256) and expire (`TOKEN_TTL_SECONDS`, 7 days by default).
- In production the API refuses to start with a weak `JWT_SECRET`, and cookies are `Secure`.
- Cross-site request protection: the cookie is `SameSite=Lax` by default and CORS only allows `FRONTEND_URL`. If the storefront and API are on different sites, set `COOKIE_SAMESITE=none` (HTTPS required) and keep `FRONTEND_URL` exact.

## Settings (backend `.env`)
| Name | Default | Meaning |
| --- | --- | --- |
| `JWT_SECRET` | dev value | Long random string used to sign tokens (32+ characters in production) |
| `TOKEN_TTL_SECONDS` | `604800` | How long a login lasts (minimum 60) |
| `COOKIE_SAMESITE` | `lax` | `lax`, `strict` or `none` |
| `FRONTEND_URL` | `http://localhost:3000` | The only origin allowed to call the API with cookies |

## Creating an admin
```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='Str0ng-pass-123' npm run admin:create
```
PowerShell: `$env:ADMIN_EMAIL="you@example.com"; $env:ADMIN_PASSWORD="Str0ng-pass-123"; npm run admin:create`.
If the email already has an account it is promoted to admin and its password is left unchanged.
