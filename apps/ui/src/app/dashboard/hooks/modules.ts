import { InferModuleConfigType, Modules, ModulesTypes } from '@pynspel/common'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { selectedGuild } from '~/proxys/dashboard'
import { fetchApi } from '~/utils/fetchApi'

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

  return useMutation({
    mutationFn: (moduleData: InferModuleConfigType<M>) =>
      fetchApi<InferModuleConfigType<M>>(
        `/api/dashboard/${moduleApiResource ?? module}/${
          selectedGuild.guild?.guild_id
        }`,
        {
          method: 'PUT',
          body: JSON.stringify(moduleData),
        }
      ),
    onSuccess(data) {
      queryClient.setQueryData(
        [`module_${module}`, selectedGuild.guild?.guild_id],
        data
      )
    },
  })
}
