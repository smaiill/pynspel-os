import { BaseCommand } from '@pynspel/px'
import { CommandInteraction, PermissionFlagsBits } from 'discord.js'
import { env } from 'utils/env'
import { commandService } from '../command.service'

export class BanCommand extends BaseCommand {
  private commandService = commandService
  constructor() {
    super()
    this.setName('ban')
      .setDescription('Ban a member of your server')
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .addUserOption((option) =>
        option
          .setName('user')
          .setDescription('The user to ban')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('reason')
          .setDescription('The reason for of the ban')
          .setRequired(false)
      )
  }

  public async on(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user')
    const reason =
      (interaction.options.get('reason')?.value as string) ??
      'No reason specified'

    if (!interaction.guild) {
      await interaction.reply('Invalid guild')
      return
    }

    const isCommandActive = this.commandService.isCommandActive(
      interaction.guild.id,
      'ban'
    )

    if (!isCommandActive) {
      await interaction.reply('Command is not active')
      return
    }

    if (!user) {
      await interaction.reply('Invalid user')
      return
    }

    const member = await interaction.guild.members.fetch(user.id)

    if (!member.bannable) {
      await interaction.reply('I cant ban the user')
      return
    }

    try {
      if (env.NODE_ENV === 'developement') {
        console.log(`Should ban the member ${member.id} in production`)
        return
      }

      await member.ban({
        reason,
      })
      await interaction.reply(
        `${member.displayName} has been banned from the server`
      )
    } catch (error) {
      console.error(error)
      await interaction.reply('An error occurred while banning the user')
    }
  }
}
