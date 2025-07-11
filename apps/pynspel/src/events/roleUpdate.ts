import { BaseEvent } from '@pynspel/px'
import { RedisRole } from '@pynspel/types'
import { db } from 'db'
import { Client, Role } from 'discord.js'
import { redis } from 'utils/redis'

export class RoleUpdate extends BaseEvent<'roleUpdate'> {
  _db = db
  constructor() {
    super('roleUpdate')
  }

  private async manageCache(oldRole: Role, newRole: Role) {
    const shouldRemoveCache = areRolesEqual(
      {
        id: oldRole.id,
        name: oldRole.name,
        permissions: oldRole.permissions.bitfield.toString(),
        color: oldRole.color,
      },
      {
        id: newRole.id,
        name: newRole.name,
        permissions: newRole.permissions.bitfield.toString(),
        color: newRole.color,
      }
    )

    if (shouldRemoveCache) {
      await redis.guild.updateRole(newRole.guild.id)
    }
  }

  public async on(_: Client, oldRole: Role, newRole: Role) {
    await this.manageCache(oldRole, newRole)
  }
}

const areRolesEqual = (r1: RedisRole, r2: RedisRole) =>
  r1.color === r2.color &&
  r1.name === r2.name &&
  r1.permissions === r2.permissions
