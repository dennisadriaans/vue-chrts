interface GitHubOAuthUser {
  email: string
  name: string
  avatar_url: string
  id: string
}

const mapGitHubUser = (user: GitHubOAuthUser) => {
  const nameParts = user.name?.split(' ') || []
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  return {
    email: user.email,
    name: user.name,
    avatarUrl: user.avatar_url,
    provider: 'github' as const,
    providerUserId: user.id,
    firstName: firstName || undefined,
    lastName: lastName || undefined
  }
}

export default defineOAuthGitHubEventHandler({
  config: { emailRequired: true },
  async onSuccess(event, { user }) {
    try {
      await handleOAuthSuccess(event, mapGitHubUser(user))
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Authentication failed'
      })
    }
  }
})
