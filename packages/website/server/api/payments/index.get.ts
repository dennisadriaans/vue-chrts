export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { getPaymentsByEmail } = useStripePayments()

  if (import.meta.dev) {
    return await getPaymentsByEmail(useRuntimeConfig().adminEmail || user.email)
  } else {
    try {
      return await getPaymentsByEmail(user.email)
    } catch (error) {
      return createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve payments by email'
      })
    }
  }
})
