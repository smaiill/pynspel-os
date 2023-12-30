import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import { Client, Role } from 'discord.js'
import { redis } from 'utils/redis'

export class RoleCreate extends BaseEvent<'roleCreate'> {
  _db = db
  constructor() {
    super('roleCreate')
  }

  private async manageCache(role: Role) {
    await redis.guild.createRole(role.guild.id, {
      color: role.color,
      id: role.id,
      name: role.name,
      permissions: role.permissions.bitfield.toString(),
    })
  }

  public async on(_: Client, role: Role) {
    await this.manageCache(role)
  }
}
