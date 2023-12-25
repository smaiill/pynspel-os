import { RedisClientType } from 'redis'

export abstract class CacheBase {
  constructor(private _client: RedisClientType) {}

  public async hSetObject(
    type: string,
    id: string,
    hKey: string,
    value: object
  ) {
    return this._client.hSet(`${type}:${id}`, hKey, JSON.stringify(value))
  }

  public async hGetObject(type: string, id: string, hKey: string) {
    const object = await this._client.hGet(`${type}:${id}`, hKey)

    if (!object) {
      return null
    }

    return JSON.parse(object)
  }

  public async hInvalidate(type: string, id: string, hKey: string) {
    return this._client.hDel(`${type}:${id}`, hKey)
  }
}
