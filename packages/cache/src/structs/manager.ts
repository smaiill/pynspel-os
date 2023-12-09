import { createClient, RedisClientType } from 'redis'
import { GuildCache } from './guild'
import { UserCache } from './user'

const MAX_CONNECTION_RETRY = 10
const MIN_CONNECTION_DELAY = 100
const MAX_CONNECTION_DELAY = 60000
export class CacheManager extends GuildCache {
  public _client: RedisClientType
  public user: UserCache

  constructor(url: string) {
    super()
    this._client = createClient({
      url,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > MAX_CONNECTION_RETRY) {
            console.log('Too many retries on REDIS. Connection Terminated')
            console.log('Closing the API.')
            process.exit(1)
          } else {
            const wait = Math.min(
              MIN_CONNECTION_DELAY * Math.pow(2, retries),
              MAX_CONNECTION_DELAY
            )
            console.log('waiting', wait, 'milliseconds')
            return wait
          }
        },
      },
    })
    this.__setClientGuild(this._client)
    this.user = new UserCache(this._client)
    this.init()
  }

  private async init() {
    return await this._client.connect()
  }

  public async ping() {
    return await this._client.ping()
  }
}
