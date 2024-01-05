import { createClient, RedisClientType } from 'redis'
import { GuildCache } from './guild'
import { UserCache } from './user'

const MAX_CONNECTION_RETRY = 10
const MIN_CONNECTION_DELAY = 100
const MAX_CONNECTION_DELAY = 60000
export class CacheManager {
  public _client: RedisClientType
  public user: UserCache
  public guild: GuildCache

  constructor(url: string) {
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
            return wait
          }
        },
      },
    })
    this.user = new UserCache(this._client)
    this.guild = new GuildCache(this._client)
  }
}
