import { SavedUser } from '@pynspel/types'
import { proxy, useSnapshot } from 'valtio'

export const userProxy = proxy<{
  isAuthenticated: boolean
  user: SavedUser | null
}>({
  isAuthenticated: false,
  user: null,
})

export const useUserSnapshot = () => useSnapshot(userProxy)
