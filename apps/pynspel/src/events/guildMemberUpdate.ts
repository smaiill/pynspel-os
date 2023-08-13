import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import { Client, GuildMember } from 'discord.js'

export class GuildMemberUpdate extends BaseEvent<'guildMemberUpdate'> {
  _db = db
  constructor() {
    super('guildMemberUpdate')
  }

  public async on(client: Client, member: GuildMember) {
    //
  }
}
