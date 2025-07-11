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
export class ChannelUpdate extends BaseEvent<'channelUpdate'> {
  _db = db
  constructor() {
    super('channelUpdate')
  }

  private async manageCache(oldChannel: Channel, newChannel: Channel) {
    if (
      !validChannels.includes(oldChannel.type) &&
      !validChannels.includes(newChannel.type)
    ) {
      return
    }

    const shouldRemoveCache = areChannelsEqual(
      {
        type: oldChannel.type,
        name: oldChannel.name,
      },
      {
        type: newChannel.type,
        name: newChannel.name,
      }
    )

    if (shouldRemoveCache) {
      try {
        await redis.guild.updateChannel(newChannel.guild.id)
      } catch (error) {
        logger.error((error as Error).stack)
        await redis.guild.invalidateChannels(newChannel.guildId)
      }
    }
  }

  public async on(_: Client, oldChannel: Channel, newChannel: Channel) {
    await this.manageCache(oldChannel, newChannel)
  }
}

type ChannelEqual = { type: number; name: string }

const areChannelsEqual = (obj1: ChannelEqual, obj2: ChannelEqual) =>
  obj1.name === obj2.name && obj1.type === obj2.type
