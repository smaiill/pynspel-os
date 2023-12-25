import { OAuth2User, SavedUser } from '@pynspel/types'
import { db } from 'modules/db'
import { DiscordRoutes } from 'utils/constants'
import { redis } from 'utils/redis'

// TODO: Move this to redis cache.
class _UserService {
  public async getDiscordUser(
    accessToken: string,
    userId?: string
  ): Promise<OAuth2User> {
    if (userId) {
      const userData = await redis.user.getUser(userId)
      if (userData) {
        return userData
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
      redis.user.setUser(userId, jsonRes)
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
