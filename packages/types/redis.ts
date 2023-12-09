export type RedisChannel = {
  name: string
  id: string
  guild_id: string
  type: number
}

export type RedisRole = {
  id: string
  name: string
  permissions: string
  color: number
}

// * Only store the id, owner, permissions.
// * When i get from the cache i send the data that i have in the database
export type RedisUserGuild = {
  id: string
  permissions: string
  owner: boolean
}
