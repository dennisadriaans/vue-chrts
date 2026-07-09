import { nanoid } from 'nanoid'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$default(() => nanoid()),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' })
    .notNull()
    .default(false),
  role: text('role').notNull().default(UserRole.USER),
  name: text('name').notNull(),
  avatarUrl: text('avatarUrl'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$default(
    () => new Date()
  ),
  provider: text('provider'),
  providerUserId: text('provider_user_id'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date()
  ),
  lastActive: integer('last_active', { mode: 'timestamp' }).$onUpdate(
    () => new Date()
  ),
  hashedPassword: text('hashedPassword'),
  banned: integer('banned', { mode: 'boolean' }).notNull().default(false),
  bannedReason: text('bannedReason'),
  onboarded: integer('onboarded', { mode: 'boolean' }).notNull().default(false)
})
