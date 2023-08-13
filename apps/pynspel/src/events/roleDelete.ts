import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import { Client, Role } from 'discord.js'
import { redis } from 'utils/redis'

export class RoleDelete extends BaseEvent<'roleDelete'> {
  _db = db
  constructor() {
    super('roleDelete')
  }

  private async manageCache(role: Role) {
    await redis.deleteRole(role.guild.id, role.id)
  }

  public async on(client: Client, role: Role) {
    await this.manageCache(role)
  }
}
