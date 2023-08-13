import { EmbedBuilder, GuildMember } from 'discord.js'
import { MemberRemove } from 'events/guildMemberRemove'
import { DiscordColors } from '../../constants/index'

const getGuildMemberAddDescription = (member: GuildMember) => {
  return `
  🎊 This user joined the server.\n
    > Member: ${member.user} - ID [\`${
    member.user.id
  }\`]\n> Account Created: \`${new Date(
    member.user.createdAt
  ).toLocaleString()}\`\n> Account Age: \`${calculateAccountAge(
    member.user.createdAt
  )} Days\`
    `
}

const getGuildMemberRemoveDescription = (member: MemberRemove) => {
  return `
   😔 This user left the server.\n
    > Member: ${member.user} - ID [\`${
    member.user.id
  }\`]\n> Account Created: \`${new Date(
    member.user.createdAt
  ).toLocaleString()}\`\n> Account Age: \`${calculateAccountAge(
    member.user.createdAt
  )} Days\`
    `
}

export class loggingEmbeds {
  static guildMemberAdd(member: GuildMember) {
    return new EmbedBuilder({
      author: {
        name: member.user.username,
        icon_url: member.user.displayAvatarURL(),
      },
      color: DiscordColors.Green,
      description: getGuildMemberAddDescription(member),
    }).setTimestamp()
  }

  static guildMemberRemove(member: MemberRemove) {
    return new EmbedBuilder({
      author: {
        name: member.user.username,
        icon_url: member.user.displayAvatarURL(),
      },
      color: DiscordColors.Red,
      description: getGuildMemberRemoveDescription(member),
    }).setTimestamp()
  }
}

const calculateAccountAge = (creationDate: Date) => {
  const currentTimestamp = Date.now()
  const creationTimestamp = creationDate.getTime()
  const ageInMilliseconds = currentTimestamp - creationTimestamp
  return Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24))
}
