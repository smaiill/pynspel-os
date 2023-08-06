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

export class ChannelCreate extends BaseEvent<'channelCreate'> {
  _db = db
  constructor() {
    super('channelCreate')
  }

  private async manageCache(channel: Channel) {
    if (!validChannels.includes(channel.type)) {
      return
    }

    const cachedChannels =
      (await redis.hGetObject('guild', channel.guild.id, 'channels')) ?? []
    cachedChannels.push({
      type: channel.type,
      name: channel.name,
      parent: {
        id: channel?.parent?.id ?? null,
        name: channel?.parent?.name ?? null,
      },
    })

    await redis.hSetObject(
      'guild',
      channel.guild.id,
      'channels',
      cachedChannels
    )
  }

  public async on(client: Client, channel: Channel) {
    this.manageCache(channel)
  }
}
