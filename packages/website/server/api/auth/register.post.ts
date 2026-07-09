import { z } from 'zod'
import { findUserByEmail, createUser } from '~~/server/db/actions/users'
import { OneTimePasswordTypes } from '~~/server/db/schema/oneTimePasswords'
import { renderOtpTemplate } from '~~/server/utils/email-templates'

const { fromEmail, emailProvider } = useRuntimeConfig()
const { baseUrl } = useRuntimeConfig().public

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8)
})

interface EmailOptions {
  to: string
  from: string
  subject: string
  html: string
}

async function handleUserValidation(email: string): Promise<void> {
  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User already exists'
    })
  }
}

async function sendVerificationEmail(
  email: string,
  oneTimePassword: string,
  emailVerificationCode: string
): Promise<void> {
  if (import.meta.dev) {
    // dev only
    console.table({ email, oneTimePassword, emailVerificationCode })
  } else {
    const html = renderOtpTemplate({
      logoUrl: 'https://nuxtcharts.com/logo.png',
      code: oneTimePassword,
      link: `${baseUrl}/api/auth/verify-email-token?token=${emailVerificationCode}`,
      domain: baseUrl,
      type: 'verification'
    })
    const emailOptions: EmailOptions = {
      to: email,
      from: fromEmail,
      subject: 'Nuxt Charts - Signup',
      html
    }
    // @ts-ignore
    await useEmail(emailProvider).send(emailOptions)
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, name, password } = registerSchema.parse(body)

    await handleUserValidation(email)

    const hashedPassword = hashPassword(password)
    const user = await createUser({
      email,
      name,
      hashedPassword
    })

    const emailVerificationCode = await generateEmailVerificationCode(user.id)
    const oneTimePassword = await generateOneTimePassword(
      user.id,
      email,
      OneTimePasswordTypes.signup
    )

    await sendVerificationEmail(email, oneTimePassword, emailVerificationCode)

    // Set user session after registration
    await setUserSession(event, {
      user: sanitizeUser(user)
    })

    setResponseStatus(event, 201)
    return sanitizeUser(user)
  } catch (error: any) {
    console.error('Registration error:', error)
    throw createError({
      statusCode: error.statusCode || 400,
      statusMessage: error.statusMessage || error.message || 'Internal Server Error'
    })
  }
})
