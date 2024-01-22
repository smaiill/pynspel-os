import { Px } from '@pynspel/px'
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
import { _CommandService } from 'modules/command/command.service'
import { BanCommand } from 'modules/command/handlers/ban'
import { env } from 'utils/env'
import { logger } from 'utils/logger'
import { redis } from 'utils/redis'
import './managers/websocket'
import { startWs } from './managers/websocket'
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

  startWs()

  await client.exe()
}

start()
