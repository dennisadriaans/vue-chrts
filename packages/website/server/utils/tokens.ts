import { useDB } from '~~/server/db'

export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Buffer.from(hashBuffer).toString('hex')
}

export async function validateToken(token: string): Promise<{ isValid: boolean, userId?: string, name?: string }> {
  try {
    const db = useDB()
    const fullTokenHash = await hashToken(token)

    // Direct hash lookup works for both old (JWT-like) and new (shorter) tokens
    const result = await db.$client
      .prepare('SELECT user_id, name FROM api_tokens WHERE token_hash = ?')
      .bind(fullTokenHash)
      .first() as { user_id: string, name: string } | null

    if (!result) {
      return { isValid: false }
    }

    return {
      isValid: true,
      userId: result.user_id,
      name: result.name
    }
  } catch (error) {
    console.error('Token validation error:', error)
    return { isValid: false }
  }
}
