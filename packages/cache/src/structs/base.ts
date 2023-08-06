import { InferModuleConfigType, ModulesTypes } from '@pynspel/common'
import { createClient, RedisClientType } from 'redis'

const Keys = {
  guild: 'guild',
  user: 'user',
} as const

type Key = keyof typeof Keys

export class CacheManager {
  public _client: RedisClientType

  constructor(url: string) {
    this._client = createClient({
      url,
    })
    this.init()
  }

  private async init() {
    return await this._client.connect()
  }

  public async hSetObject(type: Key, id: string, hKey: string, value: object) {
    return await this._client.hSet(`${type}:${id}`, hKey, JSON.stringify(value))
  }

  public async hGetObject(type: Key, id: string, hKey: ModulesTypes | string) {
    const object = await this._client.hGet(`${type}:${id}`, hKey)

    if (!object) {
      return undefined
    }

    return JSON.parse(object)
  }

  public async hInvalidate(type: Key, id: string, hKey: string) {
    return await this._client.hDel(`${type}:${id}`, hKey)
  }

  public async ping() {
    return await this._client.ping()
  }

  public async setGuildModule<M extends ModulesTypes>(
    guildId: string,
    moduleName: M,
    moduleConfig: InferModuleConfigType<M>
  ) {
    return await this.hSetObject(
      Keys.guild,
      guildId,
      `module_${moduleName}`,
      moduleConfig as object
    )
  }

  public async getGuidModule<M extends ModulesTypes>(
    guildId: string,
    moduleName: M
  ): Promise<InferModuleConfigType<M>> {
    return await this.hGetObject(Keys.guild, guildId, `module_${moduleName}`)
  }

  public async invalidateGuildModule<M extends ModulesTypes>(
    guildId: string,
    moduleName: M
  ) {
    return await this.hInvalidate(Keys.guild, guildId, `module_${moduleName}`)
  }
}
