import { InferModuleConfigType, ModulesTypes } from '@pynspel/common'
import { createClient, RedisClientType } from 'redis'
import { RedisChannel } from '@pynspel/types'
import { GuildCache } from './guild'

export class CacheManager extends GuildCache {
  public _client: RedisClientType

  constructor(url: string) {
    super()
    this._client = createClient({
      url,
    })
    this.__setClientGuild(this._client)
    this.init()
  }

  private async init() {
    return await this._client.connect()
  }

  public async ping() {
    return await this._client.ping()
  }
}
