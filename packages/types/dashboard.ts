import { RedisChannel, RedisRole, SavedGuild } from './index'

export type ApiGuild = SavedGuild & {
  roles: RedisRole[]
  channels: RedisChannel[]
}
