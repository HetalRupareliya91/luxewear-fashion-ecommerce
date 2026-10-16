# LuxeWear Fashion E-Commerce

A fashion e-commerce platform: customer storefront, REST API and admin panel in one monorepo.

## Applications
- `frontend`: Next.js customer storefront
- `backend`: Node.js + Express API + Prisma
- `admin`: Next.js administration panel

## Requirements
- Node.js 20+
- npm 10+
- PostgreSQL 16+ (or Docker)

## Run PostgreSQL
From the repository root:
```bash
docker compose up -d
```

## Frontend
```bash
cd frontend
npm install
npm run dev
```
http://localhost:3000

## Backend
```bash
cd backend
npm install
copy .env.example .env
npm run prisma:generate
npm run dev
```
http://localhost:5000
Health: http://localhost:5000/api/health

## Admin
```bash
cd admin
npm install
npm run dev
```
http://localhost:3001

## Features
- Storefront: shop filters and search, product pages, cart, wishlist, checkout, sign-in, account settings and order history
- API: sign-in with cookie sessions, server-priced orders with stock control, coupons, payments through a signed webhook, reviews from verified buyers, wishlists
- Admin API: dashboard summary, orders, customers, products and coupons (the admin panel itself still shows sample data)

## Sample data
```bash
cd backend
npx prisma migrate dev
npm run db:seed
```

## Documentation
- [API reference](docs/api.md)
- [Authentication](docs/auth.md)
- [Payments](docs/payments.md)
- [Architecture](docs/architecture.md)
- [Testing](docs/testing.md)
- [Deployment](docs/deployment.md)
- [Storefront](docs/frontend.md), [admin](docs/admin.md), [git workflow](docs/git-workflow.md)
