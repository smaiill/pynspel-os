import { BaseEvent } from '@pynspel/px'
import { Client, Events, GuildMember } from 'discord.js'
import { captchaService } from 'modules/captcha/captcha.service'
import { loggingService } from 'modules/logging/logging.service'
import { raidCounterService } from 'modules/raidCounter/raidCounter.service'
import { db } from '../db/index'

export class GuildMemberAdd extends BaseEvent<Events.GuildMemberAdd> {
  private _db = db
  private raidCounterService = raidCounterService
  private loggingService = loggingService
  constructor() {
    super(Events.GuildMemberAdd)
  }
  public async on(client: Client, member: GuildMember) {
    await this.loggingService.guildMemberAdd(member)

    const passedRaidCounter = await this.raidCounterService.handleMember(member)

    if (!passedRaidCounter) {
      return
    }

    await captchaService.handleMember(client, member)
  }
}
