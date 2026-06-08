import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

export default function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  }

  return stripePromise;
}
