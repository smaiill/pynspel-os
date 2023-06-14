import { BotModuleConfig } from '@pynspel/types'
import { fetchApi } from '~/utils/fetchApi'

export const useBotModuleService = () => {
  const getGuildConfig = async (guildId: bigint) => {
    return await fetchApi<{ bot_module: BotModuleConfig }>(
      `/api/dashboard/bot/${guildId}`
    )
  }

  const updateConfiguration = async ({
    newConfig,
    guildId,
  }: {
    newConfig: BotModuleConfig
    guildId: bigint
  }) => {
    return await fetchApi(`/api/dashboard/bot/${guildId}`, {
      method: 'PUT',
      body: JSON.stringify({ config: newConfig }),
    })
  }

  return { getGuildConfig, updateConfiguration }
}
