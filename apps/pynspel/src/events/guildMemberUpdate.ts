import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import { Client, GuildMember } from 'discord.js'
import { redis } from 'utils/redis'

type ShouldUpdateUserGuildInCache = {
  permissions: string
  owner: boolean
}

type UpdateUserGuildCache = {
  id: string
  permissions: string
  owner: boolean
  memberId: string
}

export class GuildMemberUpdate extends BaseEvent<'guildMemberUpdate'> {
  _db = db
  constructor() {
    super('guildMemberUpdate')
  }

  private hasAdminPermissions(bitfield: number) {
    return (bitfield & 0x8) === 0x8
  }

  private shouldUpdateUserGuildInCache(
    oldMember: ShouldUpdateUserGuildInCache,
    newMember: ShouldUpdateUserGuildInCache
  ): boolean {
    if (oldMember.owner === newMember.owner) {
      if (oldMember.permissions === newMember.permissions) {
        return false
      }
    }

    return true
  }

  private async updateUserGuildCache(data: UpdateUserGuildCache) {
    const userGuilds = (await redis.user.getGuilds(data.memberId)) ?? []

    const guildToUpdate = userGuilds.find((guild) => guild.id === data.id)

    if (!guildToUpdate) {
      userGuilds.push({
        id: data.id,
        owner: data.owner,
        permissions: data.permissions,
      })
    } else {
      guildToUpdate.owner = data.owner
      guildToUpdate.permissions = data.permissions
    }

    return await redis.user.setGuilds(data.memberId, userGuilds)
  }

  public async on(
    client: Client,
    oldMember: GuildMember,
    newMember: GuildMember
  ) {
    console.log({
      old: oldMember.guild.ownerId === oldMember.id,
      new: newMember.guild.ownerId === newMember.id,
    })

    const shouldUpdateCache = this.shouldUpdateUserGuildInCache(
      {
        permissions: oldMember.permissions.bitfield.toString(),
        owner: oldMember.guild.ownerId === oldMember.id,
      },
      {
        permissions: newMember.permissions.bitfield.toString(),
        owner: newMember.guild.ownerId === newMember.id,
      }
    )

    if (shouldUpdateCache) {
      await this.updateUserGuildCache({
        id: newMember.guild.id,
        permissions: newMember.permissions.bitfield.toString(),
        owner: newMember.guild.ownerId === newMember.id,
        memberId: newMember.id,
      })
    }
  }
}
