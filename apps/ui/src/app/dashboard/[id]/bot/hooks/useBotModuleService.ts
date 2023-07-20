import { InferModuleConfigType, Modules } from '@pynspel/common'
import { fetchApi } from '~/utils/fetchApi'

export const useBotModuleService = () => {
  const getGuildConfig = async (guildId: string) => {
    return await fetchApi<{
      bot_module: InferModuleConfigType<(typeof Modules)['bot']>
    }>(`/api/dashboard/bot/${guildId}`)
  }

  const updateConfiguration = async ({
    newConfig,
    guildId,
  }: {
    newConfig: InferModuleConfigType<(typeof Modules)['bot']>
    guildId: string
  }) => {
    return await fetchApi<{
      bot_module: InferModuleConfigType<(typeof Modules)['bot']>
    }>(`/api/dashboard/bot/${guildId}`, {
      method: 'PUT',
      body: JSON.stringify({ config: newConfig }),
    })
  }

  return { getGuildConfig, updateConfiguration }
}
