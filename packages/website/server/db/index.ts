import { db, schema } from 'hub:db'

export const tables = schema

/**
 * Returns a Drizzle instance.
 */
export function useDB() {
  return db
}
