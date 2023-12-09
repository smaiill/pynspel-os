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
import { BanCommand } from 'modules/command/handlers/ban'
import { env } from 'utils/env'
import { logger } from 'utils/logger'
import './managers/websocket'
import { KickCommand } from './modules/command/handlers/kick'

if (env.NODE_ENV === 'production') {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(reason)
    logger.error(promise)
  })

  process.on('uncaughtException', (error, origin) => {
    logger.error(error)
    logger.error(origin)
  })
}

const client = new Px({
  token: env.CLIENT_TOKEN,
  intents: 3276799,
  commands: [new KickCommand(), new BanCommand()],
  // syncCommands: true,
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
})

client.exe()
