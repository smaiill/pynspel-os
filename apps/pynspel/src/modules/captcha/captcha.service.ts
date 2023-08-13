import { ChannelType, Client, GuildMember } from 'discord.js'
import { ModuleServiceBase } from 'modules/module.service.base'
import { captchaEmbeds } from './captcha.embeds'
import { CaptchaManager } from './managers/CaptchaManager'

class CaptchaService extends ModuleServiceBase<'captcha'> {
  constructor() {
    super('captcha')
  }

  public async handleMember(client: Client<true>, member: GuildMember) {
    const guildId = member.guild.id

    const res = await this.getFreshConfigOrCached(guildId)

    if (!res.verification_channel) {
      return console.log('Guild has no verification channel')
    }

    const channel = await client.channels.fetch(res.verification_channel)

    if (!channel || channel.type !== ChannelType.GuildText) {
      return console.log('Invalid channel')
    }

    const captcha = new CaptchaManager({ ...res })
    const { image } = captcha.create()

    const { embed } = captchaEmbeds.embedJoin({
      avatarUrl: member.user.displayAvatarURL(),
      guildName: member.guild.name,
      username: member.user.username,
      caseSensitive: res.case_sensitive,
    })

    const message = await channel.send({
      embeds: [embed],
      files: [
        {
          attachment: image,
          name: 'captcha.png',
        },
      ],
    })

    captcha.verify({ member, channel, captchaMessage: message })
  }
}

export const captchaService = new CaptchaService()
