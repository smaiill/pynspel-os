import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import {
  ChannelType,
  Client,
  DMChannel,
  Guild,
  NonThreadGuildBasedChannel,
  Role,
} from 'discord.js'
import { captureRejectionSymbol } from 'events'
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
        permissions: oldRole.permissions,
        color: oldRole.color,
      },
      {
        id: newRole.id,
        name: newRole.name,
        permissions: newRole.permissions,
        color: newRole.color,
      }
    )

    if (shouldRemoveCache) {
      await redis.hInvalidate('guild', newRole.guild.id, 'roles')
    }
  }

  public async on(client: Client, oldRole: Role, newRole: Role) {
    this.manageCache(oldRole, newRole)
  }
}

const areRolesEqual = (obj1: object, obj2: object) => {
  const keys1 = Object.keys(obj1)

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return true
    }
  }
  return false
}
