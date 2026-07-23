import { useDB } from '~~/server/db'
import { validateToken } from '~~/server/utils/tokens'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { token } = body

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token is required'
    })
  }

  const { isValid, name, userId } = await validateToken(token)

  if (!isValid || !userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    })
  }

  // Get user email to check payment status
  const user = await useDB().$client
    .prepare('SELECT email FROM users WHERE id = ?')
    .bind(userId)
    .first() as { email: string } | null

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not found'
    })
  }

  const { checkHasPaid } = useStripePayments()
  const { hasAllAccess, hasUIThemeEditor } = await checkHasPaid(user.email)

  // CLI tokens require All Access Pass
  if (name?.startsWith('cli:') && !hasAllAccess) {
    throw createError({
      statusCode: 403,
      statusMessage: 'CLI access requires an All-Access Pass.'
    })
  }

  // UI Editor tokens require either UI Theme Editor or All Access Pass
  if (name?.startsWith('ui-editor:') && !hasUIThemeEditor && !hasAllAccess) {
    throw createError({
      statusCode: 403,
      statusMessage:
        'UI Editor access requires a Nuxt UI Theme Editor license or an All-Access Pass.'
    })
  }

  return {
    valid: true,
    tokenName: name,
    userId,
    hasAllAccess,
    hasUIThemeEditor
  }
})
