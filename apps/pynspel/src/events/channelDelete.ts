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

export class ChannelDelete extends BaseEvent<'channelDelete'> {
  _db = db
  constructor() {
    super('channelDelete')
  }

  private async manageCache(channel: Channel) {
    if (!validChannels.includes(channel.type)) {
      return
    }

    await redis.deleteChannel(channel.guild.id, channel.id)
  }

  public async on(client: Client, channel: Channel) {
    await this.manageCache(channel)
  }
}
