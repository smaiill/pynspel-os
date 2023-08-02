import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import {
  ChannelType,
  Client,
  DMChannel,
  Guild,
  NonThreadGuildBasedChannel,
} from 'discord.js'
import { captureRejectionSymbol } from 'events'
import { redis } from 'utils/redis'

type Channel = NonThreadGuildBasedChannel

const validChannels = [
  ChannelType.GuildText,
  ChannelType.GuildVoice,
  ChannelType.GuildCategory,
]

type ValidChannels = keyof typeof validChannels

export class ChannelDelete extends BaseEvent<'channelDelete'> {
  _db = db
  constructor() {
    super('channelDelete')
  }

  private async manageCache(channel: Channel) {
    if (!validChannels.includes(channel.type)) {
      return
    }

    const cachedChannels = await redis.hGetObject(
      'guild',
      channel.guild.id,
      'channels'
    )

    if (!cachedChannels) {
      return
    }

    const newChannels = cachedChannels.filter(
      (_channel) => _channel.id !== channel.id
    )

    await redis.hSetObject('guild', channel.guild.id, 'channels', newChannels)
  }

  public async on(client: Client, channel: Channel) {
    this.manageCache(channel)
  }
}
