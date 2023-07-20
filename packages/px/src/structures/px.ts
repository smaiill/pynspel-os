import { Client, ClientOptions } from 'discord.js'
import { EventClass } from './event'

export interface PxOptions extends ClientOptions {
  token: string
  debug?: boolean
  events: EventClass[]
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
  private _debug: boolean
  private _events: EventClass[]
  constructor({ token, debug = false, events, ...rest }: PxOptions) {
    super({
      ...rest,
    })
    this._debug = debug
    this._token = token
    this._events = events
    this.__validateOptions()
    this.__setupEvents()
  }

  private __validateOptions() {
    if (!this._token) {
      throw new Error('Invalid Token')
    }
  }

  private __setupEvents() {
    for (const event of this._events) {
      this.on(event._eventName, (...args) => event.on(this, ...args))
    }
  }

  public async exe() {
    try {
      await this.login(this._token)
      _customLog(COLORS.GREEN, `> Client connected !`)
    } catch (error) {
      this.debug(
        COLORS.RED,
        `> An error occured while starting client: ${error}}`
      )
    }
  }

  private debug(color: ColorValue, content: unknown) {
    this._debug && _customLog(color, content)
  }
}
