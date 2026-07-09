import { useDB } from '~~/server/db'
import { useBlob } from '~~/server/utils/blob'
import { validateToken } from '~~/server/utils/tokens'

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event)

  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Token required.'
    })
  }

  // Validate token
  const { isValid, userId, name: tokenName } = await validateToken(token as string)
  if (!isValid || !userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token.'
    })
  }

  // Check payment status
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
  if (tokenName?.startsWith('cli:') && !hasAllAccess) {
    throw createError({
      statusCode: 403,
      statusMessage: 'CLI access requires an All-Access Pass.'
    })
  }

  // UI Editor tokens require either UI Theme Editor or All Access Pass
  if (tokenName?.startsWith('ui-editor:') && !hasUIThemeEditor && !hasAllAccess) {
    throw createError({
      statusCode: 403,
      statusMessage:
        'UI Editor access requires a Nuxt UI Theme Editor license or an All-Access Pass.'
    })
  }

  // General check for any other token types
  if (
    !tokenName?.startsWith('cli:')
    && !tokenName?.startsWith('ui-editor:')
    && !hasAllAccess
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Valid license required for this action.'
    })
  }

  const filePath = params.path as string

  try {
    const file = await useBlob().get(filePath)

    if (!file) {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found'
      })
    }

    // Set appropriate headers based on file extension
    const ext = filePath.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'

    if (ext === 'zip') {
      contentType = 'application/zip'
    }

    setHeader(event, 'Content-Type', contentType)
    setHeader(
      event,
      'Content-Disposition',
      `attachment; filename="${filePath.split('/').pop()}"`
    )

    return file
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error reading file'
    })
  }
})
