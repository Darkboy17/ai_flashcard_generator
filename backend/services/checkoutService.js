import { getStripeClient } from "../clients/stripe.js";
import { formatAmountForStripe } from "../utils/stripe.js";

const PRO_SUBSCRIPTION_PRICE = {
  amount: 10,
  currency: "usd",
  interval: "month",
};

export async function createCheckoutSession({ frontendUrl }) {
  const stripe = getStripeClient();
  const resultUrl = `${frontendUrl}/result?session_id={CHECKOUT_SESSION_ID}`;

  return stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: PRO_SUBSCRIPTION_PRICE.currency,
          product_data: {
            name: "Pro subscription",
          },
          unit_amount: formatAmountForStripe(PRO_SUBSCRIPTION_PRICE.amount),
          recurring: {
            interval: PRO_SUBSCRIPTION_PRICE.interval,
            interval_count: 1,
          },
        },
        quantity: 1,
      },
    ],
    success_url: resultUrl,
    cancel_url: resultUrl,
  });
}

export async function retrieveCheckoutSession(sessionId) {
  const stripe = getStripeClient();

  return stripe.checkout.sessions.retrieve(sessionId);
}
