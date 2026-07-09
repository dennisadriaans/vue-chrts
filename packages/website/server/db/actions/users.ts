import { eq } from 'drizzle-orm'
import { tables, useDB } from '~~/server/db'
import type { InsertUser, User } from '~~/types/database'

export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const [existingUser] = await useDB()
      .select()

      .from(tables.users)
      .where(eq(tables.users.email, email))
    return existingUser || null
  } catch (error) {
    console.error(error)
    return null
  }
}

export const updateLastActiveTimestamp = async (
  userId: string
): Promise<InsertUser> => {
  try {
    const record = await useDB()
      .update(tables.users)
      .set({ lastActive: new Date() })
      .where(eq(tables.users.id, userId))
      .returning()
      .get()
    return record
  } catch (error) {
    console.error(error)
    throw new Error('Failed to update last active')
  }
}

export const createUser = async (payload: InsertUser) => {
  try {
    const record = await useDB()
      .insert(tables.users)
      .values(payload)
      .onConflictDoUpdate({
        target: tables.users.email,
        set: {
          name: payload.name,
          avatarUrl: payload.avatarUrl
        }
      })
      .returning()
      .get()
    return record
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create user with OAuth')
  }
}

export const updateUser = async (userId: string, payload: Partial<User>) => {
  try {
    const record = await useDB()
      .update(tables.users)
      .set(payload)
      .where(eq(tables.users.id, userId))
      .returning()
      .get()
    return record
  } catch (error) {
    console.error(error)
    throw new Error('Failed to update user')
  }
}
