import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import { Client, GuildMember, PartialGuildMember } from 'discord.js'
import { loggingService } from 'modules/logging/logging.service'
import { redis } from 'utils/redis'

export type MemberRemove = GuildMember | PartialGuildMember

export class GuildMemberRemove extends BaseEvent<'guildMemberRemove'> {
  private _db = db
  private loggingService = loggingService
  constructor() {
    super('guildMemberRemove')
  }

  private async removeGuildForUser(userId: string, guildId: string) {
    const userGuilds = await redis.user.getGuilds(userId)

    if (!userGuilds) {
      return
    }

    const filteredGuilds = userGuilds.filter((guild) => guild.id !== guildId)

    await redis.user.setGuilds(userId, filteredGuilds)
  }

  public async on(_: Client, member: MemberRemove) {
    this.loggingService.guildMemberRemove(member)

    await this.removeGuildForUser(member.id, member.guild.id)
  }
}
