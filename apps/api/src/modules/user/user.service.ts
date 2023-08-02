import { OAuth2User } from '@pynspel/types'
import { Caches, usersCache } from 'utils/cache'
import { DiscordRoutes } from 'utils/constants'
import { env } from 'utils/env'

class _UserService {
  public async getDiscordUser(
    accessToken: string,
    userId?: string
  ): Promise<OAuth2User> {
    console.log('1')
    if (env.NODE_ENV === 'developement') {
      console.log('2')
      return {
        id: '504227742678646784',
        username: 'smail.',
        avatar: 'dd5bf03cf11d79ecbe51088cfde42940',
        discriminator: '0',
        public_flags: 256,
        flags: 256,
        banner: null,
        accent_color: 723466,
        locale: 'fr',
        mfa_enabled: true,
        premium_type: 0,
        email: 'smailaberkaoui@gmail.com',
        verified: true,
      }
    }

    console.log('3')

    if (userId) {
      if (usersCache.has(`${Caches.Users}-${userId}`)) {
        console.log('Sending cache data')
        return usersCache.get(`${Caches.Users}-${userId}`)
      }
    }

    const response = await fetch(DiscordRoutes.USERS_ME, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Discord user')
    }

    const jsonRes = await response.json()

    if (userId) {
      usersCache.set(`${Caches.Users}-${userId}`, jsonRes, 120)
    }

    return jsonRes
  }
}

export const UserService = new _UserService()
