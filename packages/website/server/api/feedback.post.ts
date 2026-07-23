export default defineEventHandler(async (event) => {
  const { token, message, email } = await readBody(event)

  if (!token) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Token not provided.'
    })
  }

  if (await verifyTurnstileToken(token)) {
    const { send } = createPlunkService()

    try {
      await send({
        from: 'dennis@nuxtcharts.com',
        to: useRuntimeConfig().notificationEmail,
        subject: 'Feedback via website',
        html: `${message}<br><br>Email: ${email || 'No email provided'}`
      })
    } catch (e) {
      console.error('Error sending feedback email:', e)
    }

    return {
      message: 'thank you'
    }
  }
})
