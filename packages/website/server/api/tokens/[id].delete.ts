import { useDB } from '~~/server/db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const tokenId = getRouterParam(event, 'id')

  if (!tokenId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token ID is required'
    })
  }

  try {
    const { success } = await useDB().$client
      .prepare('DELETE FROM api_tokens WHERE id = ? AND user_id = ?')
      .bind(tokenId, user.id)
      .run()

    if (!success) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Token not found'
      })
    }

    return { success: true }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete token'
    })
  }
})
