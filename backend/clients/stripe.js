import Stripe from "stripe";

import { getRequiredEnv } from "../utils/env.js";

let stripeClient;

export function getStripeClient() {
  if (!stripeClient) {
    stripeClient = new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"), {
      apiVersion: "2022-11-15",
    });
  }

  return stripeClient;
}
