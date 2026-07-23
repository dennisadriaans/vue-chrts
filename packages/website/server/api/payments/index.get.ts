export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { getPaymentsByEmail } = useStripePayments()

  if (import.meta.dev) {
    return await getPaymentsByEmail('adriaansendennis@gmail.com')
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
