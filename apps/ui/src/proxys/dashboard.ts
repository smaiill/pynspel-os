import { SavedGuild } from '@pynspel/types'
import { ChannelType } from 'discord-api-types/v10'
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

export const useCurrentGuildChannels = (type?: ChannelType) => {
  const guild = useCurrentGuildValue()

  if (!guild) {
    return []
  }

  if (!type) {
    return guild.channels
  }

  return guild.channels.filter((channel) => channel.type === type)
}

export const useCurrentGuildRoles = (includeEveryone = false) => {
  const guild = useCurrentGuildValue()

  if (!guild) {
    return []
  }

  if (includeEveryone) {
    return guild.roles
  }

  return guild.roles.filter((_role) => _role.id !== guild.guild_id)
}

export const useCurrentGuildCategorys = () =>
  useCurrentGuildChannels(ChannelType.GuildCategory)
