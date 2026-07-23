import {
  sqliteTable,
  text,
  integer,
  uniqueIndex
} from 'drizzle-orm/sqlite-core'

import { nanoid } from 'nanoid'
import { users } from './users'

export enum OneTimePasswordTypes {
  signup = 'SIGNUP',
  login = 'LOGIN',
  forgotPassword = 'FORGOT_PASSWORD'
}

export const oneTimePasswords = sqliteTable('one_time_passwords', {
  id: text('id')
    .primaryKey()
    .$default(() => nanoid()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  identifier: text('identifier').notNull(),
  code: text('code').notNull(),
  type: text('type').notNull().default(OneTimePasswordTypes.signup),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
})
