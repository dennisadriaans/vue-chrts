import { eq, desc } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { apiTokens } from '~~/server/db/schema/apiTokens'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    // Get user's tokens from database
    const results = await useDB()
      .select({
        id: apiTokens.id,
        name: apiTokens.name,
        createdAt: apiTokens.createdAt
      })
      .from(apiTokens)
      .where(eq(apiTokens.userId, user.id))
      .orderBy(desc(apiTokens.createdAt))
    return {
      tokens: results || []
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tokens'
    })
  }
})
