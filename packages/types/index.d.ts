export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  NO_CONTENT = 204,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export type HTTPCodes = `${HttpStatus}` extends `${infer T extends number}`
  ? T
  : never

export type OAuth2TokenResponse = {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

export type OAuth2User = {
  id: string
  username: string
  discriminator: string
  avatar: string
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  banner?: string | null
  accent_color?: number | null
  locale?: string | null
  verified?: boolean
  email?: string | null
  flags?: number | null
  premium_type?: number | null
  public_flags?: number | null
}

export type User = {
  discordId: string
  accessToken: string
  refreshToken: string
  username: string
  discriminator: string
  avatar: string
}

export type DiscordGuild = {
  id: string
  name: string
  icon: string
  owner: boolean
  permissions: string
  features: string[]
}

export type Guild = {
  guild_id: string
  name: string
  avatar: string
}

export type SavedGuild = Guild & { id: number }

export type SavedUser = User & { id: number }

export type Tokens = {
  accessToken: string
  refreshToken: string
}

type CamelCase<S extends string> =
  S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
    : Lowercase<S>

export type KeysToCamelCase<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K]
}
