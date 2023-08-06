import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import { ChannelType, Client, NonThreadGuildBasedChannel } from 'discord.js'
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
        parent: {
          id: oldChannel?.parent?.id ?? null,
          name: oldChannel?.parent?.name ?? null,
        },
      },
      {
        type: newChannel.type,
        name: newChannel.name,
        parent: {
          id: newChannel?.parent?.id ?? null,
          name: newChannel?.parent?.name ?? null,
        },
      }
    )

    if (shouldRemoveCache) {
      await redis.hInvalidate('guild', newChannel.guild.id, 'channels')
    }
  }

  public async on(client: Client, oldChannel: Channel, newChannel: Channel) {
    this.manageCache(oldChannel, newChannel)
  }
}

const areChannelsEqual = (obj1: object, obj2: object) => {
  const keys1 = Object.keys(obj1)

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return true
    }
  }
  return false
}
