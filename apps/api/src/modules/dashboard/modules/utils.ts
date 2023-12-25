import { RedisChannel } from '@pynspel/types'

export const isChannelIdInArray = (
  channels: RedisChannel[],
  channelId: string
) => !!channels.find((_channel) => _channel.id === channelId)
