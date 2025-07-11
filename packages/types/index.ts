import { Plans } from './stripe'

export * from './dashboard'
export * from './errors'
export * from './modules/index'
export * from './redis'
export * from './routes'
export * from './stripe'
export * from './websocket'

export enum HttpStatus {
  // Informational
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,

  // Success
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTI_STATUS = 207,
  ALREADY_REPORTED = 208,
  IM_USED = 226,

  // Redirection
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  USE_PROXY = 305,
  UNUSED = 306, // No longer used, but still reserved
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,

  // Client Errors
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_AM_A_TEAPOT = 418, // An April Fools' joke RFC
  MISDIRECTED_REQUEST = 421,
  UNPROCESSABLE_ENTITY = 422,
  LOCKED = 423,
  FAILED_DEPENDENCY = 424,
  TOO_EARLY = 425,
  UPGRADE_REQUIRED = 426,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,

  // Server Errors
  SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  VARIANT_ALSO_NEGOTIATES = 506,
  INSUFFICIENT_STORAGE = 507,
  LOOP_DETECTED = 508,
  NOT_EXTENDED = 510,
  NETWORK_AUTHENTICATION_REQUIRED = 511,
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
  email: string
  customerId: null | string
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
  avatar: string | null
  bot: boolean
  owner: string
}

export type SavedGuild = Guild & { id: string; plan: Plans }

export type SavedUser = User & { id: string }

export type Tokens = {
  accessToken: string
  refreshToken: string
}
