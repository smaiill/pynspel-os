import { InferModuleConfigType, ModulesTypes } from '@pynspel/common'
import { RedisChannel, RedisRole } from '@pynspel/types'
import { RedisClientType } from 'redis'

const GuildCacheKeys = {
  Modules: 'Modules',
  Channels: 'Channels',
  Roles: 'Roles',
  Guilds: 'Guilds',
} as const

const CHANNELS_TTL = 600
const ROLES_TTL = 600

export class GuildCache {
  public _client: RedisClientType | null = null

  protected __setClientGuild(client: RedisClientType) {
    this._client = client
  }

  public async hSetObject(
    type: string,
    id: string,
    hKey: string,
    value: object
  ) {
    if (!this._client) {
      return console.error('Invalid redis client')
    }
    return await this._client.hSet(`${type}:${id}`, hKey, JSON.stringify(value))
  }

  public async hGetObject(type: string, id: string, hKey: string) {
    if (!this._client) {
      return console.error('Invalid redis client')
    }
    const object = await this._client.hGet(`${type}:${id}`, hKey)

    if (!object) {
      return null
    }

    return JSON.parse(object)
  }

  public async hInvalidate(type: string, id: string, hKey: string) {
    if (!this._client) {
      return console.error('Invalid redis client')
    }
    return await this._client.hDel(`${type}:${id}`, hKey)
  }

  public async setModule<M extends ModulesTypes>(
    guildId: string,
    moduleName: M,
    moduleConfig: InferModuleConfigType<M>
  ) {
    return await this.hSetObject(
      GuildCacheKeys.Modules,
      guildId,
      `module_${moduleName}`,
      moduleConfig as object
    )
  }

  public async getModule<M extends ModulesTypes>(
    guildId: string,
    moduleName: M
  ): Promise<InferModuleConfigType<M>> {
    return await this.hGetObject(
      GuildCacheKeys.Modules,
      guildId,
      `module_${moduleName}`
    )
  }

  public async invalidateModule<M extends ModulesTypes>(
    guildId: string,
    moduleName: M
  ) {
    return await this.hInvalidate(
      GuildCacheKeys.Modules,
      guildId,
      `module_${moduleName}`
    )
  }

  public async setChannels(guildId: string, channels: RedisChannel[]) {
    if (!this._client) {
      return console.error('Invalid redis client')
    }

    console.log(`Setting channels... for guild ${guildId}`)
    return await this._client.setEx(
      `${GuildCacheKeys.Channels}:${guildId}`,
      CHANNELS_TTL,
      JSON.stringify(channels)
    )
  }

  public async updateChannels(guildId: string, channels: RedisChannel[]) {
    if (!this._client) {
      return console.error('Invalid redis client')
    }

    return await this._client.set(
      `${GuildCacheKeys.Channels}:${guildId}`,
      JSON.stringify(channels),
      { KEEPTTL: true }
    )
  }

  public async getChannels(guildId: string) {
    if (!this._client) {
      console.error('Invalid redis client')
      return
    }

    const channels = await this._client.get(
      `${GuildCacheKeys.Channels}:${guildId}`
    )

    if (!channels) {
      return null
    }

    return JSON.parse(channels) as RedisChannel[]
  }

  public async invalidateChannels(guildId: string) {
    if (!this._client) {
      return console.error('Invalid redis client')
    }

    return await this._client.del(`${GuildCacheKeys.Channels}:${guildId}`)
  }

  public async doesChannelExists(guildId: string, channelId: string) {
    const guildChannels = await this.getChannels(guildId)

    console.log({ guildChannels })
    if (!guildChannels) {
      return false
    }

    return !!guildChannels.find((channel) => channel.id === channelId)
  }

  public async areValidChannels(guildId: string, channels: string[]) {
    const guildChannels = (await this.getChannels(guildId)) ?? []

    return channels.every((channelId) =>
      guildChannels.some((channel) => channel.id === channelId)
    )
  }

  public async updateChannel(guildId: string) {
    if (!this._client) {
      return console.error('Invalid redis client')
    }

    return await this._client.del(`${GuildCacheKeys.Channels}:${guildId}`)
  }

  public async deleteChannel(guildId: string, channelId: string) {
    if (!this._client) {
      return console.error('Invalid redis client')
    }

    const cachedChannels = await this.getChannels(guildId)

    if (!cachedChannels) {
      return
    }

    const newChannels = cachedChannels.filter(
      (_channel) => _channel.id !== channelId
    )

    return await this.updateChannels(guildId, newChannels)
  }

  public async createChannel(guildId: string, channel: RedisChannel) {
    const cachedChannels = await this.getChannels(guildId)

    if (!cachedChannels) {
      await this.setChannels(guildId, [channel])

      return [channel]
    }

    await this.updateChannels(guildId, [...cachedChannels, channel])

    return [...cachedChannels, channel]
  }

  public async setRoles(guildId: string, roles: RedisRole[]) {
    if (!this._client) {
      return console.error('Invalid redis client')
    }
    return await this._client.setEx(
      `${GuildCacheKeys.Roles}:${guildId}`,
      ROLES_TTL,
      JSON.stringify(roles)
    )
  }

  public async updateRoles(guildId: string, roles: RedisRole[]) {
    if (!this._client) {
      return console.error('Invalid redis client')
    }

    return await this._client.set(
      `${GuildCacheKeys.Roles}:${guildId}`,
      JSON.stringify(roles),
      { KEEPTTL: true }
    )
  }

  public async doesRoleExists(guildId: string, roleId: string) {
    const guildRoles = await this.getRoles(guildId)

    if (!guildRoles) {
      return false
    }

    return !!guildRoles.find((role) => role.id === roleId)
  }

  public async areValidRoles(guildId: string, roles: string[]) {
    const guildRoles = (await this.getRoles(guildId)) ?? []

    return roles.every((roleId) =>
      guildRoles.some((role) => role.id === roleId)
    )
  }

  public async getRoles(guildId: string) {
    if (!this._client) {
      console.error('Invalid redis client')
      return
    }

    const roles = await this._client.get(`${GuildCacheKeys.Roles}:${guildId}`)
    console.log({ roles })
    if (!roles) {
      return null
    }

    return JSON.parse(roles) as RedisRole[]
  }

  public async invalidateRoles(guildId: string) {
    if (!this._client) {
      return console.error('Invalid redis client')
    }

    return await this._client.del(`${GuildCacheKeys.Roles}:${guildId}`)
  }

  public async updateRole(guildId: string) {
    if (!this._client) {
      return console.error('Invalid redis client')
    }

    return await this._client.del(`${GuildCacheKeys.Roles}:${guildId}`)
  }

  public async deleteRole(guildId: string, roleId: string) {
    if (!this._client) {
      return console.error('Invalid redis client')
    }

    const cachedRoles = await this.getRoles(guildId)

    if (!cachedRoles) {
      return
    }

    const newRoles = cachedRoles.filter((_role) => _role.id !== roleId)

    return await this.updateRoles(guildId, newRoles)
  }

  public async createRole(guildId: string, role: RedisRole) {
    const cachedRoles = await this.getRoles(guildId)

    if (!cachedRoles) {
      await this.setRoles(guildId, [role])

      return [role]
    }

    await this.updateRoles(guildId, [...cachedRoles, role])

    return [...cachedRoles, role]
  }
}
