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

export class RoleCreate extends BaseEvent<'roleCreate'> {
  _db = db
  constructor() {
    super('roleCreate')
  }

  private async manageCache(role: Role) {
    const cachedRoles =
      (await redis.hGetObject('guild', role.guild.id, 'roles')) ?? []
    cachedRoles.push({
      id: role.id,
      name: role.name,
      permissions: role.permissions,
      color: role.color,
    })
    await redis.hSetObject('guild', role.guild.id, 'roles', cachedRoles)
  }

  public async on(client: Client, role: Role) {
    this.manageCache(role)
  }
}
