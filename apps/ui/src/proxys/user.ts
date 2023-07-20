import { DiscordGuild, SavedUser } from '@pynspel/types'
import { proxy, useSnapshot } from 'valtio'

export const userProxy = proxy<{
  isAuthenticated: boolean
  user: SavedUser | null
}>({
  isAuthenticated: false,
  user: null,
})

export const userGuildsProxy = proxy<{ guilds: DiscordGuild[] }>({
  guilds: [],
})

export const useUserSnapshot = () => useSnapshot(userProxy)
export const useUserGuildsSnapshot = () => useSnapshot(userGuildsProxy)
