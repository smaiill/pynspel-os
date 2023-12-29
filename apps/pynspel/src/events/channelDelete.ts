import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import { ChannelType, Client, NonThreadGuildBasedChannel } from 'discord.js'
import { logger } from 'utils/logger'
import { redis } from 'utils/redis'

type Channel = NonThreadGuildBasedChannel

const validChannels = [
  ChannelType.GuildText,
  ChannelType.GuildVoice,
  ChannelType.GuildCategory,
]

export class ChannelDelete extends BaseEvent<'channelDelete'> {
  _db = db
  constructor() {
    super('channelDelete')
  }

  private async manageCache(channel: Channel) {
    if (!validChannels.includes(channel.type)) {
      return
    }

    const guildId = channel.guild.id

    try {
      await redis.guild.deleteChannel(guildId, channel.id)
    } catch (error) {
      logger.error(error)
      await redis.guild.invalidateChannels(guildId)
    }
  }

  public async on(_: Client, channel: Channel) {
    await this.manageCache(channel)

    if (channel.type === ChannelType.GuildText) {
      await this._db.closeTicket(channel.id, channel.guild.id)
    }
  }
}
