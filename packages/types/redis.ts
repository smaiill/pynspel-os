export type RedisChannel = {
  name: string
  id: string
  guild_id: string
  type: number
}

export type RedisRole = {
  id: string
  name: string
  permissions: number
  color: number
}
