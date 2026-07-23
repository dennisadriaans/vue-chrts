import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'
import { customAlphabet, nanoid } from 'nanoid'
import { useDB } from '../db'

/**
 * Hashes a password using scrypt.
 * @param {string} password - The password to hash.
 * @returns {string} - The hashed password in the format salt:hash.
 */
export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

/**
 * Verifies a password against a hash.
 * @param {string} password - The password to verify.
 * @param {string} hash - The hashed password in the format salt:hash.
 * @returns {boolean} - True if the password matches the hash.
 */
export const verifyPassword = (password: string, hash: string): boolean => {
  const [salt, key] = hash.split(':')
  const keyBuffer = Buffer.from(key, 'hex')
  const derivedKey = scryptSync(password, salt, 64)
  return timingSafeEqual(keyBuffer, derivedKey)
}

/**
 * Generates a new email verification code for a user and stores it in the database.
 *
 * @param {SelectUser} user - The user object containing user details.
 * @param {number} [expiresIn=10800000] - The time in milliseconds until the verification code expires. Defaults to 3 hours.
 * @returns {Promise<String>} - A promise that resolves to the generated email verification code.
 */

export const generateEmailVerificationCode = async (
  userId: string,
  expiresIn: number = 1000 * 60 * 60 * 3 // 3 hours default
): Promise<string> => {
  const code = nanoid(32)
  await useDB()
    .insert(tables.emailVerificationCodes)
    .values({
      userId: userId,
      code,
      expiresAt: new Date(new Date().getTime() + expiresIn)
    })
  return code
}

/**
 * Generates a new one time password for a user and stores it in the database.
 * @param {String} userId - The user id.
 * @param {number} [expiresIn=1000 * 60 * 60 * 3] - The time in milliseconds until the one time password expires. Defaults to 3 hours.
 * @param {OneTimePassword} type - The type of one time password to generate.
 * @param {String} [identifier] - An identifier for the one time password. Mostly used for email verification.
 * @returns {Promise<String>} - A promise that resolves to the generated one time password.
 */

export const generateOneTimePassword = async (
  userId: string,
  identifier: string,
  type: OneTimePassword,
  expiresIn: number = 1000 * 60 * 60 * 3 // 3 hours default
): Promise<string> => {
  const code = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)()
  await useDB()
    .insert(tables.oneTimePasswords)
    .values({
      userId: userId,
      code,
      type,
      identifier,
      expiresAt: new Date(new Date().getTime() + expiresIn)
    })
  return code
}

export const generateResetPasswordToken = async (
  userId: string,
  expiresIn: number = 1000 * 60 * 60 * 3 // 3 hours default
): Promise<string> => {
  const code = nanoid(32)
  await useDB()
    .insert(tables.passwordResetTokens)
    .values({
      userId: userId,
      code,
      expiresAt: new Date(new Date().getTime() + expiresIn)
    })
  return code
}

/*
 * This function is used to remove sensitive information from the user object
 *
 * @param user - The user object to sanitize
 * @returns The sanitized user object
 */
export const sanitizeUser = (
  user: any,
  showBannedData: boolean = false
) => {
  if (!user) return null
  const sanitized = { ...user }
  if (!showBannedData) {
    delete sanitized.banned
    delete sanitized.bannedReason
  }
  delete sanitized.hashedPassword
  return sanitized
}
