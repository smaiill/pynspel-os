import { OAuth2User, RedisUserGuild } from '@pynspel/types'
import { CACHE_OPTIONS } from 'consts'
import { RedisClientType } from 'redis'
import { CacheBase } from './base'

export class UserCache extends CacheBase {
  constructor(private client: RedisClientType) {
    super(client)
  }

  private getKeyName(userId: string) {
    return `${CACHE_OPTIONS.keys.USER_GUILDS}::${userId}`
  }

  public async getGuilds(userId: string) {
    const userGuilds = await this.client.get(this.getKeyName(userId))

    if (!userGuilds) {
      return null
    }

    return JSON.parse(userGuilds) as RedisUserGuild[]
  }

  public async setGuilds(userId: string, guilds: RedisUserGuild[]) {
    try {
      return await this.client.setEx(
        this.getKeyName(userId),
        CACHE_OPTIONS.ttl.USER_GUILDS,
        JSON.stringify(guilds)
      )
    } catch (error) {
      console.log('Error while updating the user guilds', error)
      this.invalidateGuilds(userId)
    }
  }

  public async invalidateGuilds(userId: string) {
    return this.client.del(this.getKeyName(userId))
  }

  public async setUser(userId: string, user: OAuth2User) {
    return this.client.setEx(
      `${CACHE_OPTIONS.keys.USER}_${userId}`,
      CACHE_OPTIONS.ttl.USER,
      JSON.stringify(user)
    )
  }

  public async getUser(userId: string) {
    const user = await this.client.get(`${CACHE_OPTIONS.keys.USER}_${userId}`)

    if (!user) {
      return null
    }

    return JSON.parse(user) as OAuth2User
  }
}
