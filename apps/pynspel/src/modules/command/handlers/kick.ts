import { BaseCommand } from '@pynspel/px'
import { CommandInteraction, PermissionFlagsBits } from 'discord.js'
import { env } from 'utils/env'
import { logger } from 'utils/logger'
import { _CommandService } from '../command.service'

export class KickCommand extends BaseCommand {
  constructor(private service: _CommandService) {
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
    const user = interaction.options.get('user')
    const reason =
      (interaction.options.get('reason')?.value as string) ??
      'No reason specified'

    if (!interaction.guild) {
      await interaction.reply({
        ephemeral: true,
        content: 'Unknown guild.',
      })
      return
    }

    const isCommandActive = await this.service.isCommandActive(
      interaction.guild.id,
      'kick'
    )

    if (!isCommandActive) {
      await interaction.reply({
        ephemeral: true,
        content: 'Command is not active',
      })
      return
    }

    if (!user || !user.user) {
      await interaction.reply({
        ephemeral: true,
        content: 'Invalid user',
      })
      return
    }

    const member = await interaction.guild.members.fetch(user.user.id)

    if (!member.kickable) {
      await interaction.reply({
        ephemeral: true,
        content: 'I cant kick the user',
      })
      return
    }

    try {
      if (env.NODE_ENV === 'developement') {
        await interaction.reply(
          `Should kick the member ${member.id} in production`
        )
        return
      }

      await member.kick(reason)
      await interaction.reply({
        content: `${member.displayName} has been kicked from the server`,
        ephemeral: true,
      })
    } catch (error) {
      logger.error((error as Error).stack)
      await interaction.reply({
        content: 'An error occurred while kicking the user',
        ephemeral: true,
      })
    }
  }
}
