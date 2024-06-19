import { Px } from '@pynspel/px'
import { TextChannel } from 'discord.js'
import { ChannelCreate } from 'events/channelCreate'
import { ChannelDelete } from 'events/channelDelete'
import { ChannelUpdate } from 'events/channelUpdate'
import { GuildCreate } from 'events/guildCreate'
import { GuildDelete } from 'events/guildDelete'
import { GuildMemberAdd } from 'events/guildMemberAdd'
import { GuildMemberRemove } from 'events/guildMemberRemove'
import { GuildMemberUpdate } from 'events/guildMemberUpdate'
import { GuildUpdate } from 'events/guildUpdate'
import { InteractionCreate } from 'events/interactionCreate'
import { MessageCreate } from 'events/messageCreate'
import { RoleCreate } from 'events/roleCreate'
import { RoleDelete } from 'events/roleDelete'
import { RoleUpdate } from 'events/roleUpdate'
import { startHeartbeat } from 'managers/heartbeat'
import { captchaEmbeds } from 'modules/captcha/captcha.embeds'
import { CaptchaManager } from 'modules/captcha/managers/CaptchaManager'
import { _CommandService } from 'modules/command/command.service'
import { BanCommand } from 'modules/command/handlers/ban'
import { env } from 'utils/env'
import { logger } from 'utils/logger'
import { redis } from 'utils/redis'
import { KickCommand } from './modules/command/handlers/kick'

if (env.NODE_ENV === 'production') {
  process.on('uncaughtException', (error, origin) => {
    logger.error(error.stack)
    logger.error(JSON.stringify(origin))
  })
}

const client = new Px({
  token: env.CLIENT_TOKEN,
  intents: 3276799,
  commands: [
    new KickCommand(new _CommandService()),
    new BanCommand(new _CommandService()),
  ],
  syncCommands: env.NODE_ENV === 'production',
  events: [
    new ChannelCreate(),
    new ChannelDelete(),
    new ChannelUpdate(),
    new GuildCreate(),
    new GuildDelete(),
    new GuildMemberAdd(),
    new GuildMemberRemove(),
    new GuildMemberUpdate(),
    new InteractionCreate(),
    new MessageCreate(),
    new RoleCreate(),
    new RoleDelete(),
    new RoleUpdate(),
    new GuildUpdate(),
  ],
  onCommandError(error) {
    logger.error(error.stack)
  },
  onEventError(error) {
    logger.error(error.stack)
  },
})

const start = async () => {
  await redis._client.connect()

  await redis._client
    .ping()
    .then(() => logger.info('[REDIS-PYNSPEL] Started.'))
    .catch((err) => {
      logger.error('[REDIS-PYNSPEL] Error starting the redis client', err)
      process.exit(1)
    })

  // startWs() // TODO: Re enble if need
  startHeartbeat()
  await client.exe()

  const captcha = new CaptchaManager({
    case_sensitive: true,
    has_numbers: true,
    max_retries: 2,
    timeout: 60,
    verification_channel: '1230900542612570164',
    role_id: null,
    length: 8,
  })
  const { image } = captcha.create()

  const { embed } = captchaEmbeds.embedJoin({
    avatarUrl:
      'https://media.discordapp.net/attachments/1140624907714183229/1141084210875080734/image.png?ex=663dc63c&is=663c74bc&hm=67b0040bbe1329985bb4d3af5c883fa1875d855bd2766410322d5d8c1871fb32&=&format=webp&quality=lossless&width=421&height=549',
    guildName: 'name',
    username: 'username',
    caseSensitive: true,
  })

  const channel = (await client.channels.fetch(
    '1230900542612570164'
  )) as TextChannel

  await channel.send({
    embeds: [embed],
    files: [
      {
        attachment: image,
        name: 'captcha.png',
      },
    ],
  })
}

start()
