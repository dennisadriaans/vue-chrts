import {
  sqliteTable,
  text,
  integer
} from 'drizzle-orm/sqlite-core'

import { users } from './users'

export const emailVerificationCodes = sqliteTable('email_verification_codes', {
  id: integer('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  code: integer('code').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
})
