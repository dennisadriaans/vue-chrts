import {
  findUserByEmail,
  createUser,
  updateUser
} from '~~/server/db/actions/users'

export interface OAuthUserData {
  email: string
  name: string
  avatarUrl: string
  provider: 'discord' | 'google' | 'github'
  providerUserId: string
  firstName?: string
  lastName?: string
}

export const handleOAuthSuccess = async (
  event: any,
  oauthUser: OAuthUserData
) => {
  // 2. Check if user exists
  let dbUser = await findUserByEmail(oauthUser.email)

  // 3. If new user, create user with OAuth data
  if (!dbUser) {
    dbUser = await createUser({
      email: oauthUser.email,
      name: oauthUser.name ?? oauthUser.email.split('@')[0],
      avatarUrl: oauthUser.avatarUrl,
      provider: oauthUser.provider,
      providerUserId: oauthUser.providerUserId
    })

    // 4. if New user start email sequence
    const { track } = createPlunkService()

    try {
      await track({
        event: 'user-signup',
        email: oauthUser.email,
        subscribed: true,
        firstName: oauthUser.firstName,
        lastName: oauthUser.lastName
      })
    } catch (error) {
      console.error('Failed to send welcome email:', error)
    }
  }

  // 4. Update avatar if not set
  dbUser = await updateUser(dbUser.id, {
    avatarUrl: oauthUser.avatarUrl,
    provider: oauthUser.provider,
    providerUserId: oauthUser.providerUserId
  })

  // 8. Set user session and redirect to dashboard
  await setUserSession(event, { user: dbUser })
  const redirectCookie = getCookie(event, 'redirectPath')
  return sendRedirect(event, redirectCookie ? redirectCookie : '/dashboard')
}
