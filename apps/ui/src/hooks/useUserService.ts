import { useSetUserState } from '~/proxys/user'
import { fetchApi } from '~/utils/fetchApi'

export const useUserService = () => {
  const setUser = useSetUserState()
  const getDiscordUser = async () => {
    return fetchApi<unknown>('/api/v1/users/me')
  }

  const handleLogout = async () => {
    try {
      await fetchApi('/api/v1/auth/revoke')

      setUser(null)
    } catch (error) {
      //
    }
  }

  return { getDiscordUser, handleLogout }
}
