export const API_VERSION = 'v1'
export const API_ENDPOINT = `/api`
export const DISCORD_API_VERSION = 'v10'
export const DISCORD_BASE_API =
  `https://discord.com/api/${DISCORD_API_VERSION}` as const

export const DiscordRoutes = {
  OAUTH2_TOKEN: `${DISCORD_BASE_API}/oauth2/token`,
  OAUTH2_REVOKE: `${DISCORD_BASE_API}/oauth2/token/revoke`,
  USERS_ME: `${DISCORD_BASE_API}/users/@me`,
  USERS_GUILDS: `${DISCORD_BASE_API}/users/@me/guilds`,
  GUILD: `${DISCORD_BASE_API}/guilds`,
} as const
