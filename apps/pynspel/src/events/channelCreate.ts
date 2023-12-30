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

export class ChannelCreate extends BaseEvent<'channelCreate'> {
  _db = db
  constructor() {
    super('channelCreate')
  }

  private async manageCache(channel: Channel) {
    if (!validChannels.includes(channel.type)) {
      return
    }

    try {
      await redis.guild.createChannel(channel.guild.id, {
        guild_id: channel.guild.id,
        id: channel.id,
        name: channel.name,
        type: channel.type,
      })
    } catch (error) {
      logger.error(error)
      await redis.guild.invalidateChannels(channel.guildId)
    }
  }

  public async on(_: Client, channel: Channel) {
    await this.manageCache(channel)
  }
}
