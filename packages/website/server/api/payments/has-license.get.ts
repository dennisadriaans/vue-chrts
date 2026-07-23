export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  if (!user || !(user as any).email) {
    return {
      hasAllAccess: false,
      hasUIThemeEditor: false
    }
  }

  const { checkHasPaid } = useStripePayments()

  try {
    const result = await checkHasPaid((user as any).email)

    return {
      hasAllAccess: result.hasAllAccess,
      hasUIThemeEditor: result.hasUIThemeEditor
    }
  } catch {
    return createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve payments by email'
    })
  }
})
