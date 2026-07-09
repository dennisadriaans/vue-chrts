import { useStripeRaw } from '../composables/useStripeRaw'

export default defineCachedEventHandler(
  async () => {
    const stripe = useStripeRaw()
    // Fetch the latest 10 checkout sessions
    const sessions = await stripe.checkout.sessions.list({ limit: 20 })
    if (!sessions || !sessions.data || sessions.data.length === 0) {
      return { firstname: null, date: null, city: null }
    }
    // Find the first session with payment_status 'paid'
    const session = sessions.data.find(s => s.payment_status === 'paid')
    if (!session) {
      return { firstname: null, date: null, city: null }
    }

    // Try to get customer details (name)
    let firstname = null
    if (session.customer_details && session.customer_details.name) {
      firstname = session.customer_details.name.split(' ')[0]
    }

    // Try to get billing city
    let city = null
    if (
      session.customer_details
      && session.customer_details.address
      && session.customer_details.address.city
    ) {
      city = session.customer_details.address.city
    }

    // Use created timestamp for date
    const date = session.created
      ? new Date(session.created * 1000).toISOString()
      : null
    return { firstname, date, city }
  },
  {
    swr: true,
    maxAge: 3600
  }
)
