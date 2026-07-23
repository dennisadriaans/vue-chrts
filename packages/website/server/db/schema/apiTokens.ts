import { nanoid } from 'nanoid'
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { users } from './users'

export const apiTokens = sqliteTable(
  'api_tokens',
  {
    id: text('id')
      .primaryKey()
      .$default(() => nanoid()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    tokenHash: text('token_hash').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$default(
      () => new Date()
    )
  },
  table => ({
    tokenHashIdx: index('token_hash_idx').on(table.tokenHash)
  })
)

export type ApiToken = typeof apiTokens.$inferSelect
export type NewApiToken = typeof apiTokens.$inferInsert
