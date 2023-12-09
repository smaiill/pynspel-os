import { OAuth2User, SavedUser } from '@pynspel/types'
import { db } from 'modules/db'
import { Caches, usersCache } from 'utils/cache'
import { DiscordRoutes } from 'utils/constants'

class _UserService {
  public async getDiscordUser(
    accessToken: string,
    userId?: string
  ): Promise<OAuth2User> {
    if (userId) {
      if (usersCache.has(`${Caches.Users}-${userId}`)) {
        console.log('Sending cache data')
        return usersCache.get(`${Caches.Users}-${userId}`)
      }
    }

    const response = await fetch(DiscordRoutes.USERS_ME, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Discord user')
    }

    const jsonRes = await response.json()

    if (userId) {
      usersCache.set(`${Caches.Users}-${userId}`, jsonRes, 120)
    }

    return jsonRes
  }

  async getUserByDiscordId(discordId: string) {
    const [user] = await db.exec('SELECT * FROM users WHERE discord_id = $1', [
      discordId,
    ])

    return user as SavedUser
  }
}

export const UserService = new _UserService()
