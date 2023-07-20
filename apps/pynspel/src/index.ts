import { BaseEvent, Px } from '@pynspel/px'
import { CaptchaManager } from 'builders/captcha'
import { db } from 'db'
import { Guild, Message } from 'discord.js'
import { GuildCreate, __guildCreateInstanceTest } from 'events/guildCreate'
import { GuildMemberAdd, GuildMemberAdded } from 'events/guildMemberAdd'
import { env } from 'utils/env'

const ga = new GuildMemberAdd()

const client = new Px({
  token: env.CLIENT_TOKEN,
  intents: 3276799,
  debug: true,
  events: [ga, new GuildCreate()],
})

client.exe().then(() => {
  ga.on(client, {
    id: '504227742678646784',
    guild: {
      id: '974775347553906718',
    },
  })
})
