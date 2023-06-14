import { OAuth2User } from '@pynspel/types'
import { DISCORD_ROUTES } from 'utils/constants'

class _UserService {
  public async getDiscordUser(accessToken: string): Promise<OAuth2User> {
    const response = await fetch(DISCORD_ROUTES.USERS_ME, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Discord user')
    }

    const data = await response.json()

    return data
  }
}

export const UserService = new _UserService()
