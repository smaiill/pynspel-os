import { SavedGuild } from '@pynspel/types'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const currentGuildAtom = atom<
  (SavedGuild & { roles: any[]; channels: any[] }) | null
>({
  key: 'CURRENT_GUILD',
  default: null,
})

export const useCurrentGuildValue = () => useRecoilValue(currentGuildAtom)
export const useSetCurrentGuild = () => useSetRecoilState(currentGuildAtom)
export const useCurrentGuildState = () => useRecoilState(currentGuildAtom)
