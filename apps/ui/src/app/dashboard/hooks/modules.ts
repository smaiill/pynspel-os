import { InferModuleConfigType, Modules, ModulesTypes } from '@pynspel/common'
import { ModuleStateApi } from '@pynspel/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from '~/locales/Provider'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { useGlobalModulesState, useSetGlobalModules } from '~/proxys/modules'
import { fetchApi } from '~/utils/fetchApi'
import { pxToast } from '../components/toast/toast-handler'

type GuildModule = {
  name: ModulesTypes
  is_active: boolean
  module_id: string
}

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
  })
}

export const useGuildModulesState = (guildId: string) => {
  // TODO: This makes to many requests when the id is undefined
  return useQuery<{ name: string; is_active: boolean }[]>({
    queryKey: ['modules', guildId],
    queryFn: async () => {
      return fetchApi(`/api/dashboard/guilds/${guildId}/modules`)
    },
    enabled: !!guildId,
  })
}

export const useMutateModuleState = <M extends ModulesTypes>(module: M) => {
  const queryClient = useQueryClient()
  const currentGuild = useCurrentGuildValue()
  const [globalModules] = useGlobalModulesState()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (newValue: boolean) => {
      return fetchApi(
        `/api/dashboard/guilds/${currentGuild?.guild_id}/modules/${module}`,
        {
          method: 'PUT',
          body: JSON.stringify({ is_active: newValue }),
        }
      )
    },
    onSuccess(_, value) {
      queryClient.setQueryData<GuildModule[]>(
        ['modules', currentGuild?.guild_id],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (previous) => {
          if (!previous) {
            return []
          }
          const hasModule = previous?.find((element) => element.name === module)

          if (!hasModule) {
            const moduleId = globalModules.find(
              (_module: ModuleStateApi) => _module.name === module
            )?.module_id

            return [
              ...[...(previous ?? [])],
              { name: module, id: moduleId, is_active: value },
            ]
          }
          const updatedData = previous?.map((_module) => {
            if (_module.name === module) {
              return {
                ..._module,
                is_active: value,
              }
            }

            return _module
          })
          return [...(updatedData ?? [])]
        }
      )

      pxToast('success', t('modules.common.updated'))
    },

    onError() {
      pxToast('error', t('errors.E_GENERIC'))
    },
  })
}

export const useMutateModule = <M extends ModulesTypes>(
  module: M,
  moduleApiResource?: string
) => {
  const queryClient = useQueryClient()
  const currentGuild = useCurrentGuildValue()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (moduleData: InferModuleConfigType<M>) =>
      fetchApi<InferModuleConfigType<M>>(
        `/api/dashboard/${moduleApiResource ?? module}/${
          currentGuild?.guild_id
        }`,
        {
          method: 'PUT',
          body: JSON.stringify(moduleData),
        }
      ),
    onSuccess(data) {
      pxToast('success', t('modules.common.updated'))
      queryClient.setQueryData(
        [`module_${module}`, currentGuild?.guild_id],
        data
      )
    },
    onError() {
      pxToast('error', t('errors.E_GENERIC'))
    },
  })
}

export const useGlobalModules = () => {
  const setModules = useSetGlobalModules()

  return useQuery<ModuleStateApi[]>({
    queryKey: ['modules'],
    queryFn: () => fetchApi('/api/modules'),

    onSuccess(data) {
      setModules(data)
    },
  })
}
