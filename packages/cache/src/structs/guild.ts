import { InferModuleConfigType, ModulesTypes } from '@pynspel/common'
import { RedisChannel, RedisRole } from '@pynspel/types'
import { CACHE_OPTIONS } from 'consts'
import { RedisClientType } from 'redis'
import { CacheBase } from './base'

export class GuildCache extends CacheBase {
  constructor(private client: RedisClientType) {
    super(client)
  }

  public async setModule<M extends ModulesTypes>(
    guildId: string,
    moduleName: M,
    moduleConfig: InferModuleConfigType<M>
  ) {
    return this.hSetObject(
      CACHE_OPTIONS.keys.GUILD_MODULES,
      guildId,
      `module_${moduleName}`,
      moduleConfig as object
    )
  }

  public async getModule<M extends ModulesTypes>(
    guildId: string,
    moduleName: M
  ): Promise<InferModuleConfigType<M>> {
    return this.hGetObject(
      CACHE_OPTIONS.keys.GUILD_MODULES,
      guildId,
      `module_${moduleName}`
    )
  }

  public async invalidateModule<M extends ModulesTypes>(
    guildId: string,
    moduleName: M
  ) {
    return this.hInvalidate(
      CACHE_OPTIONS.keys.GUILD_MODULES,
      guildId,
      `module_${moduleName}`
    )
  }

  public async setChannels(guildId: string, channels: RedisChannel[]) {
    return this.client.setEx(
      `${CACHE_OPTIONS.keys.GUILD_CHANNELS}:${guildId}`,
      CACHE_OPTIONS.ttl.CHANNELS,
      JSON.stringify(channels)
    )
  }

  public async updateChannels(guildId: string, channels: RedisChannel[]) {
    return this.client.set(
      `${CACHE_OPTIONS.keys.GUILD_CHANNELS}:${guildId}`,
      JSON.stringify(channels),
      { KEEPTTL: true }
    )
  }

  public async getChannels(guildId: string) {
    const channels = await this.client.get(
      `${CACHE_OPTIONS.keys.GUILD_CHANNELS}:${guildId}`
    )

    if (!channels) {
      return null
    }

    return JSON.parse(channels) as RedisChannel[]
  }

  public async invalidateChannels(guildId: string) {
    return this.client.del(`${CACHE_OPTIONS.keys.GUILD_CHANNELS}:${guildId}`)
  }

  public async doesChannelExists(guildId: string, channelId: string) {
    const guildChannels = await this.getChannels(guildId)

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
    return this.client.del(`${CACHE_OPTIONS.keys.GUILD_CHANNELS}:${guildId}`)
  }

  public async deleteChannel(guildId: string, channelId: string) {
    const cachedChannels = await this.getChannels(guildId)

    if (!cachedChannels) {
      return
    }

    const newChannels = cachedChannels.filter(
      (_channel) => _channel.id !== channelId
    )

    return this.updateChannels(guildId, newChannels)
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
    return this.client.setEx(
      `${CACHE_OPTIONS.keys.GUILD_ROLES}:${guildId}`,
      CACHE_OPTIONS.ttl.ROLES,
      JSON.stringify(roles)
    )
  }

  public async updateRoles(guildId: string, roles: RedisRole[]) {
    return this.client.set(
      `${CACHE_OPTIONS.keys.GUILD_ROLES}:${guildId}`,
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
    const roles = await this.client.get(
      `${CACHE_OPTIONS.keys.GUILD_ROLES}:${guildId}`
    )

    if (!roles) {
      return null
    }

    return JSON.parse(roles) as RedisRole[]
  }

  public async invalidateRoles(guildId: string) {
    return this.client.del(`${CACHE_OPTIONS.keys.GUILD_ROLES}:${guildId}`)
  }

  public async updateRole(guildId: string) {
    return this.client.del(`${CACHE_OPTIONS.keys.GUILD_ROLES}:${guildId}`)
  }

  public async deleteRole(guildId: string, roleId: string) {
    const cachedRoles = await this.getRoles(guildId)

    if (!cachedRoles) {
      return
    }

    const newRoles = cachedRoles.filter((_role) => _role.id !== roleId)

    return this.updateRoles(guildId, newRoles)
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
