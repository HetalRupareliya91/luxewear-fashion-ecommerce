import type { Cents } from "../../utils/money.js";

export type PaymentIntent = { reference: string; clientSecret: string };

/** What the shop needs from a payment company. A real one (Stripe, Razorpay) is a drop-in replacement. */
export type PaymentProvider = {
  name: string;
  createIntent(input: { orderNumber: string; amount: Cents; currency: string }): Promise<PaymentIntent>;
};

/** Development provider: no network, predictable references. Tests and demos use it. */
export const mockProvider: PaymentProvider = {
  name: "mock",
  async createIntent({ orderNumber }) {
    const reference = `mock_${orderNumber}`;
    return { reference, clientSecret: `${reference}_secret` };
  },
};
