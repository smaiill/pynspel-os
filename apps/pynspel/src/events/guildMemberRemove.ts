import { Modules, ModulesTypes } from '@pynspel/common'
import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import {
  ChannelType,
  Client,
  GuildMember,
  PartialGuildMember,
} from 'discord.js'
import { loggingService } from 'modules/logging/logging.service'
import { redis } from 'utils/redis'

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
