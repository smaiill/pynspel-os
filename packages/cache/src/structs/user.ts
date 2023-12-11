import { RedisUserGuild } from '@pynspel/types'
import { RedisClientType } from 'redis'

const UserCacheKeys = {
  UserGuilds: 'UserGuilds',
} as const

const USER_GUILDS_TTL = 300

export class UserCache {
  constructor(private _client: RedisClientType) {}

  private getKeyName(userId: string) {
    return `${UserCacheKeys.UserGuilds}::${userId}`
  }

  public async hSetObject(
    type: string,
    id: string,
    hKey: string,
    value: object
  ) {
    return await this._client.hSet(`${type}:${id}`, hKey, JSON.stringify(value))
  }

  public async hGetObject(type: string, id: string, hKey: string) {
    const object = await this._client.hGet(`${type}:${id}`, hKey)

    if (!object) {
      return null
    }

    return JSON.parse(object)
  }

  public async hInvalidate(type: string, id: string, hKey: string) {
    return await this._client.hDel(`${type}:${id}`, hKey)
  }

  public async getGuilds(userId: string) {
    const userGuilds = await this._client.get(this.getKeyName(userId))

    if (!userGuilds) {
      return null
    }

    return JSON.parse(userGuilds) as RedisUserGuild[]
  }

  public async setGuilds(userId: string, guilds: RedisUserGuild[]) {
    try {
      return await this._client.setEx(
        this.getKeyName(userId),
        USER_GUILDS_TTL,
        JSON.stringify(guilds)
      )
    } catch (error) {
      console.log('Error while updating the user guilds', error)
      this.invalidateGuilds(userId)
    }
  }

  private isAdmin(permissions: string) {
    return (parseInt(permissions) & 0x8) === 0x8
  }

  public async invalidateGuilds(userId: string) {
    return await this._client.del(this.getKeyName(userId))
  }
}
