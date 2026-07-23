import { randomBytes } from 'crypto'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { useDB } from '~~/server/db'
import { hashToken } from '~~/server/utils/tokens'

const createTokenSchema = z.object({
  name: z.string().min(1).max(100)
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { checkHasPaid } = useStripePayments()

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const body = await readBody(event)
  const { name } = createTokenSchema.parse(body)

  const { hasAllAccess, hasUIThemeEditor } = await checkHasPaid(user.email)

  // CLI tokens require All Access Pass
  if (name.startsWith('cli:') && !hasAllAccess) {
    throw createError({
      statusCode: 403,
      statusMessage:
        'CLI access requires an All-Access Pass. Please upgrade your license.'
    })
  }

  // UI Editor tokens require either UI Theme Editor or All Access Pass
  if (name.startsWith('ui-editor:') && !hasUIThemeEditor && !hasAllAccess) {
    throw createError({
      statusCode: 403,
      statusMessage:
        'UI Editor access requires a Nuxt UI Theme Editor license or an All-Access Pass.'
    })
  }

  // General check for any paid product if it's not a specific type
  if (!name.startsWith('cli:') && !name.startsWith('ui-editor:') && !hasAllAccess) {
    throw createError({
      statusCode: 403,
      statusMessage:
        'No valid license found. Please purchase a product to gain access.'
    })
  }

  try {
    // Generate a secure random token
    const randomPart = randomBytes(20).toString('base64url')
    const fullToken = `nct_${randomPart}`

    // Store token in database
    const { success } = await useDB().$client
      .prepare(
        'INSERT INTO api_tokens (id, user_id, name, token_hash, created_at) VALUES (?, ?, ?, ?, ?)'
      )
      .bind(
        nanoid(),
        user.id,
        name,
        await hashToken(fullToken),
        new Date().toISOString()
      )
      .run()

    if (!success) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create token'
      })
    }

    return {
      token: fullToken
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create token'
    })
  }
})
