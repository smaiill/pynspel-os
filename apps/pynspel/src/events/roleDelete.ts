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

export class RoleDelete extends BaseEvent<'roleDelete'> {
  _db = db
  constructor() {
    super('roleDelete')
  }

  private async manageCache(role: Role) {
    const cachedRoles = await redis.hGetObject('guild', role.guild.id, 'roles')

    if (!cachedRoles) {
      return
    }

    const newChannels = cachedRoles.filter((_role) => _role.id !== role.id)

    await redis.hSetObject('guild', role.guild.id, 'roles', newChannels)
  }

  public async on(client: Client, role: Role) {
    this.manageCache(role)
  }
}
