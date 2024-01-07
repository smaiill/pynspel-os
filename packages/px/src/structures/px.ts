import { Client, ClientOptions, Events, Interaction } from 'discord.js'
import { CommandClass } from './command'
import { EventClass } from './event'

export interface PxOptions extends ClientOptions {
  token: string
  events?: EventClass[]
  commands?: CommandClass[]
  syncCommands?: boolean
  onCommandError?: (error: Error) => void
  onEventError?: (error: Error) => void
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
  // eslint-disable-next-line no-console
  console.log(color, content, COLORS.ESCAPE)

export class Px extends Client {
  private _token: string
  private _events: EventClass[]
  private _syncCommands: boolean
  private _commandsArray: CommandClass[] = []
  private _onCommandError?: (error: Error) => void
  private _onEventError?: (error: Error) => void
  constructor({
    token,
    events = [],
    commands = [],
    syncCommands = false,
    onCommandError,
    onEventError,
    ...rest
  }: PxOptions) {
    super({
      ...rest,
    })
    this._token = token
    this._events = events
    this._syncCommands = syncCommands
    this._onCommandError = onCommandError
    this._onEventError = onEventError
    this.__validateOptions()
    this.__setupEvents()
    this.__setupCommands(commands)
  }

  private __validateOptions() {
    if (!this._token) {
      throw new Error('Invalid Token')
    }
  }

  private __setupCommands(commands: CommandClass[]) {
    for (const command of commands) {
      this._commandsArray.push(command as unknown as never)
    }

    this.on(Events.InteractionCreate, async (interaction: Interaction) => {
      if (!interaction.isCommand()) {
        return
      }

      const command = this._commandsArray.find(
        (_command) => _command.name === interaction.commandName
      )

      if (!command) {
        return
      }

      try {
        await command.on(interaction)
      } catch (error) {
        this._onCommandError?.(error as Error)
      }
    })
  }

  private __setupEvents() {
    for (const event of this._events) {
      this.on(event._eventName, async (...args) => {
        try {
          await event.on(this, ...args)
        } catch (error) {
          this._onEventError?.(error as Error)
        }
      })
    }
  }

  public async exe() {
    try {
      await this.login(this._token)
      _customLog(COLORS.GREEN, `> Client connected !`)
      if (this._syncCommands) {
        for (const command of this._commandsArray) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          this.application?.commands
            .create({
              name: command.name,
              default_member_permissions: command.default_member_permissions,
              description: command.description,
              dm_permission: command.dm_permission,
              name_localizations: command.name_localizations,
              nsfw: command.nsfw,
            })
            .then(() =>
              _customLog(COLORS.CYAN, `> Created command ${command.name}`)
            )
        }
      }
    } catch (error) {
      _customLog(
        COLORS.RED,
        `> An error occured while starting client: ${error}}`
      )
    }
  }
}
