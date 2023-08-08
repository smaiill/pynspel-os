import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import { Client, GuildMember, Role } from 'discord.js'
import { redis } from 'utils/redis'

export class GuildMemberUpdate extends BaseEvent<'guildMemberUpdate'> {
  _db = db
  constructor() {
    super('guildMemberUpdate')
  }

  private async checkRoles(member: GuildMember) {}

  public async on(client: Client, member: GuildMember) {
    this.checkRoles(member)
  }
}
