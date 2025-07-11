import { BaseEvent } from '@pynspel/px'
import { Client, Events, GuildMember } from 'discord.js'
import { captchaService } from 'modules/captcha/captcha.service'
import { loggingService } from 'modules/logging/logging.service'
import { raidCounterService } from 'modules/raidCounter/raidCounter.service'
import { logger } from 'utils/logger'
import { redis } from 'utils/redis'
import { db } from '../db/index'

export class GuildMemberAdd extends BaseEvent<Events.GuildMemberAdd> {
  private _db = db
  private raidCounterService = raidCounterService
  private loggingService = loggingService
  constructor() {
    super(Events.GuildMemberAdd)
  }

  private async addUserGuildCache({
    userId,
    guildId,
    permissions,
  }: {
    userId: string
    guildId: string
    permissions: string
  }) {
    const userGuilds = await redis.user.getGuilds(userId)

    if (!userGuilds) {
      return
    }

    await redis.user.setGuilds(userId, [
      ...userGuilds,
      { id: guildId, owner: false, permissions },
    ])
  }
  public async on(client: Client<true>, member: GuildMember) {
    this.addUserGuildCache({
      guildId: member.guild.id,
      permissions: member.permissions.bitfield.toString(),
      userId: member.id,
    }).catch((error) => logger.error((error as Error).stack))

    this.loggingService
      .guildMemberAdd(member)
      .catch((error) => logger.error((error as Error).stack))

    const passedRaidCounter = await this.raidCounterService.handleMember(member)

    if (!passedRaidCounter) {
      return
    }
    if (member.user.bot) {
      return
    }
    await captchaService.handleMember(client, member)
  }
}
