import { Client, ClientOptions, Events, Interaction } from 'discord.js'
import { CommandClass, OnCommand } from './command'
import { EventClass } from './event'

export interface PxOptions extends ClientOptions {
  token: string
  events?: EventClass[]
  commands?: CommandClass[]
  syncCommands?: boolean
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
  private _events: EventClass[]
  private _commands = new Map<string, OnCommand>()
  private _syncCommands: boolean
  private _commandsArray: any[] = []
  private readonly discordBaseUrl = 'https://discord.com/api/v10'
  constructor({
    token,
    events = [],
    commands = [],
    syncCommands = false,
    ...rest
  }: PxOptions) {
    super({
      ...rest,
    })
    this._token = token
    this._events = events
    this._syncCommands = syncCommands
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
      this._commands.set(command.name, command.on)
    }

    this.on(Events.InteractionCreate, async (interaction: Interaction) => {
      if (!interaction.isCommand()) {
        return
      }

      const handledCommand = this._commands.get(interaction.commandName)

      if (!handledCommand) {
        return
      }

      try {
        await handledCommand(interaction)
      } catch (error) {
        console.error(
          `Error while executing command [${interaction.commandName}]`,
          error
        )
      }
    })
  }

  private __setupEvents() {
    for (const event of this._events) {
      this.on(event._eventName, async (...args) => {
        try {
          await event.on(this, ...args)
        } catch (error) {
          console.error(
            `Error while executing the event [${event._eventName}]`,
            error
          )
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
          const { on, ...rest } = command
          this.application?.commands
            .create(rest)
            .then(() =>
              _customLog(COLORS.CYAN, `> Created command ${rest.name}`)
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
