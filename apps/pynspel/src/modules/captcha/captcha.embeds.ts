import { DiscordColors } from '../../constants'
import { AttachmentBuilder, EmbedBuilder, GuildMember, User } from 'discord.js'

type EmbeJoinMember = {
  guildName: string
  username: string
  avatarUrl: string
  caseSensitive: boolean
}
class CaptchaEmbeds {
  public embedJoin({
    guildName,
    username,
    avatarUrl,
    caseSensitive,
  }: EmbeJoinMember) {
    return {
      embed: new EmbedBuilder({
        title: `Welcome on \`${guildName}\``,
        author: {
          name: username,
          icon_url: avatarUrl,
        },
        color: DiscordColors.Purple,
        description: `To gain access to the server, enter the following code.\n${
          caseSensitive ? '`⚠️ CaSe SeNsItIvE`' : ''
        }`,
        image: {
          url: 'attachment://captcha.png',
        },
      }).setTimestamp(),
    }
  }

  public embedValid(member: GuildMember) {
    return new EmbedBuilder({
      description: `🎊 Welcome on the server ${member.user}`,
      author: {
        name: member.user.username,
        icon_url: member.user.displayAvatarURL(),
      },
    }).setTimestamp()
  }

  public embedMaxRetries(member: GuildMember) {
    return new EmbedBuilder({
      author: {
        name: member.user.username,
        icon_url: member.user.displayAvatarURL(),
      },
      description: `You have been kicked from \`${member.guild.name}\` due to invalid captcha`,
    }).setTimestamp()
  }
}

export const captchaEmbeds = new CaptchaEmbeds()
