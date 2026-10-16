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
- `PATCH /api/auth/me` - `{ firstName?, lastName? }`. Changes the name of the signed-in user; an empty `lastName` clears it. An `email` or `role` in the body is ignored.
- `POST /api/auth/change-password` - `{ currentPassword, newPassword }`. 400 with `details.currentPassword` when the current password is wrong. Existing sessions stay valid until they expire.

Register and login allow 10 attempts per minute per IP.

## Products
- `GET /api/products` - active products with category, images and variants.
- `GET /api/products/categories` - all categories, A to Z.
- `GET /api/products/:slug` - one product; 404 when the slug is unknown.

## Coupons
- `POST /api/coupons/validate` - `{ code, subtotal }` (subtotal in cents). Always 200: `{ valid: true, code, type, discount }` or `{ valid: false, reason }`. Limited to 30 checks per minute per IP.

## Checkout and orders
All money is **whole cents**. The client sends only SKUs and quantities; prices, stock, coupon and totals are always worked out by the server.
- `POST /api/checkout/quote` - `{ items: [{ sku, quantity }], shippingMethod?, couponCode? }`. Public. Returns the line items, `subtotal`, `discount`, `shipping`, `tax`, `total` and `amountToFreeShipping`. A wrong coupon is reported as `couponError` next to the totals. 404 for an unknown SKU, 409 when stock is short.
- `POST /api/orders` - signed in. Same body plus `shippingAddress { firstName, lastName, line1, line2?, city, state?, postalCode, country, phone? }`. 201 with the order (`status: "PENDING"`, number like `LW-20261014-00007`). Stock is taken in the same database transaction. A bad coupon is a 400, short stock a 409.
- `GET /api/orders` - the signed-in customer's orders, newest first (`?page=&limit=`).
- `GET /api/orders/:id` - one of your orders (404 for anyone else's).
- `POST /api/orders/:id/cancel` - cancels an unpaid order and returns the stock. 409 once the order is paid.

## Payments
- `POST /api/payments/intent` - signed in, `{ orderId }`. Starts a payment for your own pending order and returns `{ reference, clientSecret, amount, currency, provider }`. The development provider is `mock`.
- `POST /api/payments/webhook` - called by the payment company, not by browsers. The body is JSON `{ type, reference }` and the header `X-Signature: sha256=<hex>` must be the HMAC-SHA256 of the **raw body** with `PAYMENT_WEBHOOK_SECRET`. `payment.succeeded` moves the order to `PAID` (sending it twice is harmless); `payment.failed` leaves it pending. 401 for a bad signature. See [payments](payments.md).

## Reviews
- `GET /api/reviews?productId=` - public. `{ reviews, summary: { count, average, distribution } }` plus paging meta.
- `POST /api/reviews` - signed in, `{ productId, rating (1-5), title?, body (10-2000 characters) }`. Only customers with a paid order containing the product can review it (403 otherwise), once each (409).
- `DELETE /api/reviews/:id` - the author or an admin.

## Wishlist
All routes need a signed-in user.
- `GET /api/wishlist` - `{ productIds }`, newest first.
- `PUT /api/wishlist/:productId` and `DELETE /api/wishlist/:productId` - add or remove; both return the new list. 404 for an unknown product.
- `POST /api/wishlist/merge` - `{ productIds }`. Adds the items saved in the browser right after sign-in; unknown ids are skipped.

## Admin (role `ADMIN` only: 401 without a login, 403 for customers)
- `GET /api/admin/summary?days=30` - revenue, order count, average order value, revenue per day, top 5 products, plus customer, product and pending-order counts.
- `GET /api/admin/orders` (`?status=&page=&limit=`), `GET /api/admin/orders/:id`, `PATCH /api/admin/orders/:id/status` with `{ status }`. Only allowed moves work (for example `PENDING` to `PAID`, `PAID` to `PROCESSING`); anything else is a 409. Cancelling puts the stock back.
- `GET /api/admin/users` (`?q=&page=&limit=`), `PATCH /api/admin/users/:id/role` with `{ role }`. You cannot change your own role.
- `GET /api/admin/products` (`?status=&q=`), `GET /api/admin/products/:id`, `POST /api/admin/products`, `PATCH /api/admin/products/:id`, `DELETE /api/admin/products/:id` (archives; nothing is ever hard-deleted), `PATCH /api/admin/products/variants/:sku/stock` with `{ stock }`. Prices are in dollars with at most two decimals.
- `GET /api/coupons`, `POST /api/coupons`, `PATCH /api/coupons/:code`, `DELETE /api/coupons/:code`. `value` is a percent (1-100) or, for `FIXED`, an amount in cents.

## Status codes
`400` validation failed - `401` missing/invalid token - `403` wrong role - `404` not found - `409` conflict (stock, order status) - `429` rate limited - `500` unexpected error.
