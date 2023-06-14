import { Client, ClientOptions } from 'discord.js'

export interface PxOptions extends ClientOptions {
  /**
   * The bot token, you can find it on Bot category on the documentation.
   */
  token: string

  /**
   * Log actions, Default `false`
   */
  logger?: boolean
}

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  ESCAPE: '\x1b[0m',
  CYAN: '\x1b[36m',
} as const

type ColorKey = keyof typeof COLORS
type ColorValue = (typeof COLORS)[ColorKey]

const _customLog = (color: ColorValue, content: unknown) =>
  console.log(color, content, COLORS.ESCAPE)

export class Px extends Client {
  private _token: string
  private _logger: boolean
  constructor({ token, logger = false, ...rest }: PxOptions) {
    super({
      ...rest,
    })
    this._logger = logger
    this._token = token
    this.__validateOptions()
  }

  public __validateOptions() {
    if (!this._token) {
      throw new Error('Invalid Token')
    }
  }

  public async exe() {
    try {
      await this.login(this._token)
      this._logger && _customLog(COLORS.GREEN, `> Client connected !`)
    } catch (error) {
      this._logger &&
        _customLog(
          COLORS.RED,
          `> An error occured while starting client: ${error}}`
        )
    }
  }
}
