import { RouteBases } from 'discord-api-types/v10'
import { env } from './env'

type DiscordApiOptions = {
  uri: string
  origin?: Origin
  base?: string
} & RequestInit

type Origin = { type: 'user'; token: string } | { type: 'bot' }

const getAuthorizationValueByOrigin = (origin: Origin) => {
  if (origin.type === 'user') {
    return `Bearer ${origin.token}`
  }

  if (origin.type === 'bot') {
    return `Bot ${env.CLIENT_TOKEN}`
  }

  return ''
}

export const discordApi = async ({
  uri,
  headers,
  origin,
  base,
  ...rest
}: DiscordApiOptions) => {
  const response = await fetch(`${base ? base : RouteBases.api}/${uri}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: origin ? getAuthorizationValueByOrigin(origin) : '',
      ...headers,
    },
    ...rest,
  })

  return await response.json()
}
