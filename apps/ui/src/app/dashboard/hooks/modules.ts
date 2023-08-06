import { InferModuleConfigType, Modules, ModulesTypes } from '@pynspel/common'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { fetchApi } from '~/utils/fetchApi'
import { pxToast } from '../components/toast/toast-handler'

export const useFetchModule = <M extends ModulesTypes>(
  module: M,
  guildId: string,
  databaseResource?: string
) => {
  return useQuery({
    queryKey: [`module_${module}`, guildId],
    queryFn: async () =>
      await fetchApi<InferModuleConfigType<(typeof Modules)[M]>>(
        `/api/dashboard/${databaseResource ?? module}/${guildId}`
      ),
    onSuccess(data) {
      console.log(data)
    },
  })
}

export const useMutateModule = <M extends ModulesTypes>(
  module: M,
  moduleApiResource?: string
) => {
  const queryClient = useQueryClient()
  const currentGuild = useCurrentGuildValue()

  return useMutation({
    mutationFn: (moduleData: InferModuleConfigType<M>) =>
      fetchApi<InferModuleConfigType<M>>(
        `/api/dashboard/${moduleApiResource ?? module}/${
          currentGuild.guild_id
        }`,
        {
          method: 'PUT',
          body: JSON.stringify(moduleData),
        }
      ),
    onSuccess(data) {
      pxToast('success', 'Module updated !')
      queryClient.setQueryData(
        [`module_${module}`, currentGuild.guild_id],
        data
      )
    },
    onError() {
      pxToast('error', 'Error, retry again.')
    },
  })
}
