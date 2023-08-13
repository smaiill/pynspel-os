import { ChannelType, GuildMember } from 'discord.js'
import { MemberRemove } from 'events/guildMemberRemove'
import { ModuleServiceBase } from 'modules/module.service.base'
import { loggingEmbeds } from './logging.embed'

class LoggingSevice extends ModuleServiceBase<'logging'> {
  constructor() {
    super('logging')
  }

  public async guildMemberAdd(member: GuildMember) {
    const config = await this.getFreshConfigOrCached(member.guild.id)

    if (!config || !config.user_join || !config.channel) {
      return
    }

    const channel = await member.guild.channels.fetch(config.channel)

    if (!channel || channel.type !== ChannelType.GuildText) {
      return
    }

    const embed = loggingEmbeds.guildMemberAdd(member)

    await channel.send({ embeds: [embed] })
  }

  public async guildMemberRemove(member: MemberRemove) {
    const config = await this.getFreshConfigOrCached(member.guild.id)

    if (!config || !config.user_left || !config.channel) {
      return
    }

    const channel = await member.guild.channels.fetch(config.channel)

    if (!channel || channel.type !== ChannelType.GuildText) {
      return
    }

    const embed = loggingEmbeds.guildMemberRemove(member)

    await channel.send({ embeds: [embed] })
  }
}

export const loggingService = new LoggingSevice()
