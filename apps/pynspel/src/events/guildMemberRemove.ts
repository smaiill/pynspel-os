import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import { Client, GuildMember, PartialGuildMember } from 'discord.js'
import { loggingService } from 'modules/logging/logging.service'

export type MemberRemove = GuildMember | PartialGuildMember

export class GuildMemberRemove extends BaseEvent<'guildMemberRemove'> {
  private _db = db
  private loggingService = loggingService
  constructor() {
    super('guildMemberRemove')
  }

  public async on(client: Client, member: MemberRemove) {
    await this.loggingService.guildMemberRemove(member)
  }
}
