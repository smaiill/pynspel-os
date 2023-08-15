import { BaseEvent } from '@pynspel/px'
import { Client, Events, GuildMember } from 'discord.js'
import { captchaService } from 'modules/captcha/captcha.service'
import { loggingService } from 'modules/logging/logging.service'
import { raidCounterService } from 'modules/raidCounter/raidCounter.service'
import { logger } from 'utils/logger'
import { db } from '../db/index'

export class GuildMemberAdd extends BaseEvent<Events.GuildMemberAdd> {
  private _db = db
  private raidCounterService = raidCounterService
  private loggingService = loggingService
  constructor() {
    super(Events.GuildMemberAdd)
  }
  public async on(client: Client, member: GuildMember) {
    try {
      this.loggingService.guildMemberAdd(member)

      const passedRaidCounter = await this.raidCounterService.handleMember(
        member
      )

      if (!passedRaidCounter) {
        return
      }

      await captchaService.handleMember(client, member)
    } catch (error) {
      logger.error(`Error while handling new member: ${JSON.stringify(error)}`)
    }
  }
}
