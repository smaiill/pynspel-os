import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import { Client, Guild } from 'discord.js'
import { redis } from 'utils/redis'

type ShouldUpdateGuild = {
  avatar: string | null
  name: string
  ownerId: string
}

type SwapOwnershipInCache = {
  userId: string
}

export class GuildUpdate extends BaseEvent<'guildUpdate'> {
  _db = db
  constructor() {
    super('guildUpdate')
  }

  private shouldUpdateGuild(
    old: ShouldUpdateGuild,
    _new: ShouldUpdateGuild
  ): boolean {
    if (old.avatar === _new.avatar) {
      if (old.name === _new.name) {
        if (old.ownerId === _new.ownerId) {
          return false
        }
      }
    }

    return true
  }

  private async swapOwnershipInCache(
    oldOwner: SwapOwnershipInCache,
    newOwner: SwapOwnershipInCache,
    guildId: string
  ) {
    const oldOwnerGuilds = (await redis.user.getGuilds(oldOwner.userId)) ?? []
    const newOwnerGuilds = (await redis.user.getGuilds(newOwner.userId)) ?? []

    const oldGuildToEdit = oldOwnerGuilds.find((guild) => guild.id === guildId)
    const newGuildToEdit = newOwnerGuilds.find((guild) => guild.id === guildId)

    if (oldGuildToEdit) {
      oldGuildToEdit.owner = false
    }

    if (newGuildToEdit) {
      newGuildToEdit.owner = true
    }

    await Promise.allSettled([
      redis.user.setGuilds(oldOwner.userId, oldOwnerGuilds),
      redis.user.setGuilds(newOwner.userId, newOwnerGuilds),
    ])
  }

  public async on(client: Client, oldGuild: Guild, newGuild: Guild) {
    const shouldUpdateGuild = this.shouldUpdateGuild(
      { avatar: oldGuild.icon, name: oldGuild.name, ownerId: oldGuild.ownerId },
      { avatar: newGuild.icon, name: newGuild.name, ownerId: newGuild.ownerId }
    )

    if (shouldUpdateGuild) {
      // TODO: Disable the recurring payment for the guild, and cancel it at period.
      await this._db.updateGuild({
        guild_id: newGuild.id,
        avatar: newGuild.icon,
        name: newGuild.name,
        owner: newGuild.ownerId,
      })
    }

    if (oldGuild.ownerId !== newGuild.ownerId) {
      await this.swapOwnershipInCache(
        { userId: oldGuild.ownerId },
        { userId: newGuild.ownerId },
        newGuild.id
      )
    }
  }
}
