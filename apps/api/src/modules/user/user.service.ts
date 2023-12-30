import { OAuth2User, SavedUser } from '@pynspel/types'
import { Routes } from 'discord-api-types/v10'
import { db } from 'modules/db'
import { discordApi } from 'utils/discord'
import { redis } from 'utils/redis'
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

    const response = await discordApi({
      uri: Routes.user(),
      origin: {
        type: 'user',
        token: accessToken,
      },
      method: 'GET',
    })

    if (userId) {
      redis.user.setUser(userId, response)
    }

    return response
  }

  async getUserByDiscordId(discordId: string) {
    const [user] = await db.exec('SELECT * FROM users WHERE discord_id = $1', [
      discordId,
    ])

    return user as SavedUser
  }
}

export const UserService = new _UserService()
