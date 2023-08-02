import { BaseCommand } from '@pynspel/px'
import { CommandInteraction, PermissionFlagsBits } from 'discord.js'
import { env } from 'utils/env'
import { commandService } from '../command.service'

export class KickCommand extends BaseCommand {
  private commandService = commandService
  constructor() {
    super()
    this.setName('kick')
      .setDescription('Kick a member of your server')
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
      .addUserOption((option) =>
        option
          .setName('user')
          .setDescription('The user to kick')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('reason')
          .setDescription('The reason for the kick')
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
      'kick'
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

    if (!member.kickable) {
      await interaction.reply('I cant kick the user')
      return
    }

    try {
      if (env.NODE_ENV === 'developement') {
        console.log(`Should kick the member ${member.id} in production`)
        return
      }

      await member.kick(reason)
      await interaction.reply(
        `${member.displayName} has been kicked from the server`
      )
    } catch (error) {
      console.error(error)
      await interaction.reply('An error occurred while kicking the user')
    }
  }
}
