# Admin guide

| Route | Purpose |
| --- | --- |
| `/` | Revenue, orders, customers, active products, sales chart, recent orders |
| `/products` | Search by name or SKU, filter by status, stock availability badges |
| `/categories` | Product count and average price per category |
| `/orders`, `/orders/[id]` | Filter by status; detail with items, totals and a status control that follows the allowed order flow |
| `/customers` | Orders and total spent per customer |
| `/inventory` | Out-of-stock and low-stock (10 units or fewer) overview |
| `/coupons` | Active, expired, used-up and inactive coupons |
| `/reviews` | Average rating, breakdown and latest feedback |
| `/analytics` | Average order value, best day, revenue by day, best sellers |
| `/settings` | Store rules currently built into the API |

Revenue counts orders in PAID, PROCESSING, SHIPPED or DELIVERED. Pending, cancelled and refunded orders are excluded.
