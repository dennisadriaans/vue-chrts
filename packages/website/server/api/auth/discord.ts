import { handleOAuthSuccess } from '@@/server/utils/oauth'

interface DiscordOAuthUser {
  id: string
  avatar: string
  global_name: string
  email: string
}

const mapDiscordUser = (user: DiscordOAuthUser) => {
  const nameParts = user.global_name?.split(' ') || []
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  return {
    email: user.email,
    name: user.global_name,
    avatarUrl: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
    provider: 'discord' as const,
    providerUserId: user.id,
    firstName: firstName || undefined,
    lastName: lastName || undefined
  }
}

export default defineOAuthDiscordEventHandler({
  config: { emailRequired: true },
  async onSuccess(event, { user }) {
    try {
      await handleOAuthSuccess(event, mapDiscordUser(user))
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Authentication failed'
      })
    }
  }
})
