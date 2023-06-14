export const API_VERSION = 'v1'
export const API_ENDPOINT = `/api`

export const DISCORD_ROUTES = {
  OAUTH2_TOKEN: 'https://discord.com/api/v10/oauth2/token',
  OAUTH2_REVOKE: 'https://discord.com/api/v10/oauth2/token/revoke',
  USERS_ME: 'https://discord.com/api/v10/users/@me',
} as const
