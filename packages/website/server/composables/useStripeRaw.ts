import Stripe from 'stripe'
import { useRuntimeConfig } from '#imports'

export const useStripeRaw = () => {
  const stripe = new Stripe(useRuntimeConfig().stripeSecretKey, {
    apiVersion: '2025-02-24.acacia'
  })
  return stripe
}
