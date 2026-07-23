export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const { send } = createPlunkService()

  const userEmail = (user as any).email || 'unknown'
  const userName = (user as any).name || (user as any).username || 'unknown'

  await send({
    from: 'dennis@nuxtcharts.com',
    to: useRuntimeConfig().notificationEmail,
    subject: 'DashboardStack Discount Request',
    html: `
      <p>A premium user has requested the DashboardStack discount.</p>
      <br>
      <p><strong>Name:</strong> ${userName}</p>
      <p><strong>Email:</strong> ${userEmail}</p>
    `
  })

  return { success: true }
})
