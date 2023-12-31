import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import { Client, Guild } from 'discord.js'
import { logger } from 'utils/logger'
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

    await Promise.all([
      redis.user.setGuilds(oldOwner.userId, oldOwnerGuilds),
      redis.user.setGuilds(newOwner.userId, newOwnerGuilds),
    ]).catch(async (e) => {
      logger.error(e)
      await redis.user.invalidateGuilds(oldOwner.userId)
      await redis.user.invalidateGuilds(newOwner.userId)
    })
  }

  public async on(_: Client, oldGuild: Guild, newGuild: Guild) {
    const shouldUpdateGuild = this.shouldUpdateGuild(
      { avatar: oldGuild.icon, name: oldGuild.name, ownerId: oldGuild.ownerId },
      { avatar: newGuild.icon, name: newGuild.name, ownerId: newGuild.ownerId }
    )

    if (shouldUpdateGuild) {
      await this._db.updateGuild({
        guild_id: newGuild.id,
        avatar: newGuild.icon,
        name: newGuild.name,
        owner: newGuild.ownerId,
      })
    }

    if (oldGuild.ownerId !== newGuild.ownerId) {
      // TODO: Disable the recurring payment for the guild, and cancel it at period.
      await this._db
        .exec(
          'UPDATE guilds_subscriptions SET cancel_at_period_end = $1 WHERE guild_id = $2',
          [true, newGuild.id]
        )
        .catch(logger.error)

      try {
        await this.swapOwnershipInCache(
          { userId: oldGuild.ownerId },
          { userId: newGuild.ownerId },
          newGuild.id
        )
      } catch (error) {
        await redis.user.invalidateGuilds(oldGuild.ownerId)
        await redis.user.invalidateGuilds(newGuild.ownerId)
      }
    }
  }
}
