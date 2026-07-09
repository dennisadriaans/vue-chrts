import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users } from '~~/server/db/schema'

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
