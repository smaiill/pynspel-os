import { InferModuleConfigType, ModulesTypes } from '@pynspel/common'
import { RedisChannel } from '@pynspel/types'
import { RedisClientType, createClient } from 'redis'

const GuildCacheKeys = {
  Modules: 'Modules',
  Channels: 'Channels',
} as const

const CHANNELS_TTL = 600

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
    return await this._client.setEx(
      `${GuildCacheKeys.Channels}:${guildId}`,
      CHANNELS_TTL,
      JSON.stringify(channels)
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

    return await this.setChannels(guildId, newChannels)
  }

  public async createChannel(guildId: string, channel: RedisChannel) {
    const cachedChannels = (await this.getChannels(guildId)) ?? []

    cachedChannels.push({
      type: channel.type,
      name: channel.name,
      id: channel.id,
      guild_id: channel.guild_id,
    })

    await this.setChannels(guildId, cachedChannels)

    return cachedChannels
  }
}
