# Payments

The shop never sees card numbers. A payment company holds the card details and tells the API the result with a **signed webhook**.

## Flow
1. The customer places an order (`POST /api/orders`). It starts as `PENDING` and the stock is reserved.
2. `POST /api/payments/intent` asks the provider for a payment and stores its `reference` on the order. The storefront would use `clientSecret` to show the provider's card form.
3. The provider calls `POST /api/payments/webhook` when the payment succeeds or fails.
4. On success the order becomes `PAID`; the admin then moves it through `PROCESSING`, `SHIPPED` and `DELIVERED`.

## Checking the signature
The header `X-Signature` is `sha256=` followed by the hex HMAC-SHA256 of the **exact request body** using `PAYMENT_WEBHOOK_SECRET`. The API keeps the raw bytes (`captureRawBody`) because re-serialising the parsed JSON could change spacing and break the match. The check is constant-time.

Try it by hand against a local server:
```bash
BODY='{"type":"payment.succeeded","reference":"mock_LW-20261014-00001"}'
SIG="sha256=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$PAYMENT_WEBHOOK_SECRET" | sed 's/^.* //')"
curl -X POST http://localhost:5000/api/payments/webhook -H "Content-Type: application/json" -H "X-Signature: $SIG" -d "$BODY"
```
Use the order's real `paymentRef` as the reference (it is `mock_` plus the order number for the development provider).

## Going live
`payment.provider.ts` defines the small `PaymentProvider` contract. Add a provider for your payment company (Stripe, Razorpay, ...) that implements `createIntent`, point `payment.routes.ts` at it, and give the company your webhook URL and secret. Nothing else changes. In production `PAYMENT_WEBHOOK_SECRET` must be 32+ characters or the server refuses to start.
