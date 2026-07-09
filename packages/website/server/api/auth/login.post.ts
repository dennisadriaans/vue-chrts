import { z } from 'zod'
import { findUserByEmail, updateLastActiveTimestamp } from '~~/server/db/actions/users'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = loginSchema.parse(body)

    const user = await findUserByEmail(email)

    if (!user || !user.hashedPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    const isValid = verifyPassword(password, user.hashedPassword)

    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    if (user.banned) {
      throw createError({
        statusCode: 403,
        statusMessage: user.bannedReason || 'Your account has been banned'
      })
    }

    // Update last active
    await updateLastActiveTimestamp(user.id)

    // Set user session
    await setUserSession(event, {
      user: sanitizeUser(user)
    })

    return sanitizeUser(user)
  } catch (error: any) {
    console.error('Login error:', error)
    throw createError({
      statusCode: error.statusCode || 400,
      statusMessage: error.statusMessage || error.message || 'Internal Server Error'
    })
  }
})
