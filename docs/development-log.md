# LuxeWear Development Log

## Day 1
- Scalable monorepo structure
- Component-driven storefront foundation
- Modular Express API foundation
- Prisma/PostgreSQL foundation
- Component-driven admin foundation

## Day 2
- Test runner (`npm test`) and type check (`npm run typecheck`) for the backend
- Shared helpers: money (cents), slugs, pagination, API responses, AppError
- Security: validated env, request ids, rate limiting, scrypt passwords, signed tokens, auth middleware
- Commerce rules with unit tests: shipping, tax, coupons, cart totals, order status flow, stock reservation, ratings, analytics

## Day 3
- Storefront: working shop filters/sort/price, search, product pages with sizes
- Cart, wishlist and checkout flow (client side, saved in localStorage)
- Order confirmation and order history, working newsletter and contact forms
- New pages: FAQ, returns, cart, checkout, account

## Day 4
- Admin: dashboard with real stats and SVG chart, products, categories, orders (+detail), customers, inventory, coupons, reviews, analytics, settings
- Storefront: privacy, terms, sitemap/robots, error and loading screens, toast notifications, richer About page

## Day 5
- API: register, login, /me and logout with an HttpOnly cookie session, login rate limit, `npm run admin:create`
- Fix: malformed JSON now returns 400 instead of 500
- Storefront: sign-in and create-account pages, account menu, profile on the account page, checkout prefill
- Docs: authentication guide
