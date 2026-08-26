# LuxeWear Fashion E-Commerce

Scalable Day 1 monorepo foundation for a fashion e-commerce platform.

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

## Day 1
Foundation only. Business features are intentionally added in later development days.
