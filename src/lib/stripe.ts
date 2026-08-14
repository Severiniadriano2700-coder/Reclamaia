import Stripe from "stripe"

const apiKey = process.env.STRIPE_SECRET_KEY

export const stripe = new Stripe(apiKey || "sk_test_placeholder", {
  apiVersion: "2026-07-29.dahlia",
  typescript: true,
})

export const isStripeConfigured = Boolean(apiKey)
