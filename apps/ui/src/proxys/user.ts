import { DiscordGuild, SavedUser } from '@pynspel/types'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const userGuildsAtom = atom<DiscordGuild[]>({
  key: 'USER_GUILDS',
  default: [],
})

export const useUserGuildsValue = () => useRecoilValue(userGuildsAtom)
export const useSetUserGuildsValue = () => useSetRecoilState(userGuildsAtom)
export const useUserGuildsState = () => useRecoilState(userGuildsAtom)

const userAtom = atom<SavedUser | null>({
  key: 'USER',
  default: null,
})

export const useUserValue = () => useRecoilValue(userAtom)
export const useSetUserState = () => useSetRecoilState(userAtom)
export const useUserState = () => useRecoilState(userAtom)
