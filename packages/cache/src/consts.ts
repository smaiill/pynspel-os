export const CACHE_OPTIONS = {
  ttl: {
    USER_GUILDS: 300,
    ROLES: 300,
    CHANNELS: 300,
    USER: 150,
  },
  keys: {
    USER_GUILDS: '_ug',
    GUILD_MODULES: '_gm',
    GUILD_CHANNELS: '_gc',
    GUILD_ROLES: '_gr',
    USER: '_u',
  },
} as const
