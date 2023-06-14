import { SavedGuild } from '@pynspel/types'
import { proxy, useSnapshot } from 'valtio'

export const selectedGuild = proxy<{ guild: SavedGuild | null }>({
  guild: null,
})

export const useSelectedGuildSnapshot = () => useSnapshot(selectedGuild)
