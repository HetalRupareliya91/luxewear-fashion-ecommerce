# Storefront guide

## Routes
| Route | What it does |
| --- | --- |
| `/` | Home: hero, collections, featured products, newsletter |
| `/shop` | Catalog with category tabs, sort, price filter (URL driven: `?category=&sort=&minPrice=&maxPrice=`) |
| `/product/[id]` | Product page: sizes, add to cart, details, related items |
| `/search?q=` | Search by name or category |
| `/cart` | Cart with quantities, promo code (`WELCOME10`), free-shipping progress |
| `/checkout` | Delivery form with validation and shipping method (demo: no payment) |
| `/order/success?id=` | Order confirmation |
| `/account` | Orders placed on this device |
| `/login`, `/register` | Sign in or create an account (cookie session from the API) |
| `/account/settings` | Edit your name and change your password |
| `/account/orders/[id]` | One account order, with cancel while it is unpaid |
| `/wishlist` | Saved products |
| `/contact`, `/faq`, `/returns` | Customer care pages |

## State
Set `NEXT_PUBLIC_API_URL` (see `frontend/.env.example`) to the API address. Account data comes from the API; cart, wishlist and orders are still local.

Cart, wishlist and orders are kept in `localStorage` (`luxewear.cart.v1`, `luxewear.wishlist.v1`, `luxewear.orders.v1`) until the API endpoints exist. Pure logic lives in `src/store/*.ts`; the React providers are in `*Context.tsx`.

## Helpers
- `utils/format.ts` prices and discounts
- `utils/catalog.ts` filter, sort and URL parameter parsing
- `utils/cartTotals.ts` totals (same rules as `backend/src/modules/cart/cart.totals.ts`)
- `utils/validators.ts` checkout form validation
