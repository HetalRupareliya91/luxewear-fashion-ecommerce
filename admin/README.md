# LuxeWear Admin

Next.js administration panel (runs on http://localhost:3001).

## Scripts
| Script | What it does |
| --- | --- |
| `npm run dev` | Start the admin on port 3001 |
| `npm run build` / `npm start` | Production build and start |
| `npm run lint` | ESLint |

## Pages
Dashboard (stats, sales chart, recent orders), Products, Categories, Orders (+ order detail), Customers, Inventory, Coupons, Reviews, Analytics and Settings.

## Data
All pages currently use sample data from `src/data/*` so the UI can be developed before the admin API exists. Business rules mirror the backend: order status flow (`lib/orderStatus.ts`), rating summaries (`lib/reviews.ts`) and revenue analytics (`lib/analytics.ts`). Replace the `src/data` imports with API calls (`src/services`) when the endpoints are ready.

## Structure
```
src/
  app/          routes
  components/   layout, ui (DataTable, StatusBadge, PageHeader), orders, dashboard, analytics
  data/         sample data
  lib/          types, formatting, order status, stats, analytics, coupons, reviews
```
