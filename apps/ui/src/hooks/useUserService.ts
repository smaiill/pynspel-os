import { userProxy } from '~/proxys/user'
import { fetchApi } from '~/utils/fetchApi'

export const useUserService = () => {
  const getDiscordUser = async () => {
    return await fetchApi<unknown>('/api/users/@me')
  }

  const handleLogout = async () => {
    try {
      await fetchApi('/api/auth/revoke')

      userProxy.isAuthenticated = false
      userProxy.user = null
    } catch (error) {
      //
    }
  }

  return { getDiscordUser, handleLogout }
}
