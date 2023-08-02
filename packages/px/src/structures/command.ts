import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

export type OnCommand = (
  interaction: CommandInteraction
) => Promise<void> | void

export interface CommandClass extends SlashCommandBuilder {
  on: OnCommand
}

export abstract class BaseCommand
  extends SlashCommandBuilder
  implements CommandClass
{
  constructor() {
    super()
  }

  abstract on(interaction: CommandInteraction): Promise<void> | void
}
