# API reference

Base URL (development): `http://localhost:5000`

Success: `{ "success": true, "data": ... , "meta"?: { page, limit, total, pages } }`
Error: `{ "success": false, "message": "...", "details"?: { field: "message" } }`

Every response carries an `X-Request-Id` header. `/api` is rate limited (300 requests per minute per IP).

## Health
- `GET /api/health` - service status and timestamp.

## Products
- `GET /api/products` - active products with category, images and variants.
- `GET /api/products/categories` - all categories, A to Z.
- `GET /api/products/:slug` - one product; 404 when the slug is unknown.

## Status codes
`400` validation failed - `401` missing/invalid token - `403` wrong role - `404` not found - `409` conflict (stock, order status) - `429` rate limited - `500` unexpected error.
