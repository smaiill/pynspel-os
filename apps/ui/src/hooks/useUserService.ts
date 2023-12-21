import { useSetUserState } from '~/proxys/user'
import { fetchApi } from '~/utils/fetchApi'

export const useUserService = () => {
  const setUser = useSetUserState()
  const getDiscordUser = async () => {
    return await fetchApi<unknown>('/api/users/me')
  }

  const handleLogout = async () => {
    try {
      await fetchApi('/api/auth/revoke')

      setUser(null)
    } catch (error) {
      //
    }
  }

  return { getDiscordUser, handleLogout }
}
