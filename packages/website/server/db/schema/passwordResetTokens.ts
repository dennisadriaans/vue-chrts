import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { nanoid } from 'nanoid'
import { users } from './users'

export const passwordResetTokens = sqliteTable('password_reset_tokens', {
  id: text('id')
    .primaryKey()
    .$default(() => nanoid()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
})
