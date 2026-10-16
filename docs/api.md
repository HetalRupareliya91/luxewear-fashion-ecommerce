# API reference

Base URL (development): `http://localhost:5000`

Success: `{ "success": true, "data": ... , "meta"?: { page, limit, total, pages } }`
Error: `{ "success": false, "message": "...", "details"?: { field: "message" } }`

Every response carries an `X-Request-Id` header. `/api` is rate limited (300 requests per minute per IP).

## Health
- `GET /api/health` - service status and timestamp.

## Auth
Sign-in uses an HttpOnly cookie (`lw_token`); the token is never in the JSON body. Non-browser clients can send `Authorization: Bearer <token>`. Details: [authentication guide](auth.md).
- `POST /api/auth/register` - `{ email, password, firstName, lastName? }`. 201 with `{ user }`. Password: 8-72 characters with a letter and a number. 409 if the email is taken. New accounts are always customers.
- `POST /api/auth/login` - `{ email, password }`. 200 with `{ user }`; every failure is `401 Invalid email or password`.
- `GET /api/auth/me` - the signed-in user, or 401.
- `POST /api/auth/logout` - clears the cookie.

Register and login allow 10 attempts per minute per IP.

## Products
- `GET /api/products` - active products with category, images and variants.
- `GET /api/products/categories` - all categories, A to Z.
- `GET /api/products/:slug` - one product; 404 when the slug is unknown.

## Status codes
`400` validation failed - `401` missing/invalid token - `403` wrong role - `404` not found - `409` conflict (stock, order status) - `429` rate limited - `500` unexpected error.
