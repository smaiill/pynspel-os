export enum Errors {
  // Guild
  E_UNKNOWN_ROLE = 'E_UNKNOWN_ROLE',
  E_UNKNOWN_CHANNEL = 'E_UNKNOWN_CHANNEL',
  E_INVALID_GUILD_ID = 'E_INVALID_GUILD_ID',
  E_CANT_ACCESS_GUILD = 'E_CANT_ACCESS_GUILD',

  // Panels
  E_EMPTY_INTERACTIONS = 'E_EMPTY_INTERACTIONS',
  E_INVALID_PANEL_ID = 'E_INVALID_PANEL_ID',

  // Stripe
  E_ALREADY_AN_ACTIVE_PLAN = 'E_ALREADY_AN_ACTIVE_PLAN',

  // Misc
  E_REPORT_ERROR = 'E_REPORT_ERROR',
  E_INVALID_DATA = 'E_INVALID_DATA',
  E_RATE_LIMITED = 'E_RATE_LIMITED',
  E_SERVICE_UNAVAILABLE = 'E_SERVICE_UNAVAILABLE',
  E_VALIDATION_ERROR = 'E_VALIDATION_ERROR',

  E_UNAUTHORIZED = 'E_UNAUTHORIZED',
  E_GENERAL = 'E_GENERAL',
}
