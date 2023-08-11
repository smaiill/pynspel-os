import { Px } from '@pynspel/px'
import { ChannelCreate } from 'events/channelCreate'
import { ChannelDelete } from 'events/channelDelete'
import { ChannelUpdate } from 'events/channelUpdate'
import { GuildCreate } from 'events/guildCreate'
import { GuildMemberAdd } from 'events/guildMemberAdd'
import { GuildMemberRemove } from 'events/guildMemberRemove'
import { InteractionCreate } from 'events/interactionCreate'
import { MessageCreate } from 'events/messageCreate'
import { RoleCreate } from 'events/roleCreate'
import { RoleDelete } from 'events/roleDelete'
import { RoleUpdate } from 'events/roleUpdate'
import { BanCommand } from 'modules/command/handlers/ban'
import { env } from 'utils/env'
import { KickCommand } from './modules/command/handlers/kick'
import { redis } from 'utils/redis'

if (env.NODE_ENV === 'production') {
  process.on('unhandledRejection', (reason, promise) => {
    console.error(reason)
    console.error(promise)
  })

  process.on('uncaughtException', (error, origin) => {
    console.error(error)
    console.error(origin)
  })
}

const ga = new GuildMemberAdd()
const gc = new GuildCreate()
const client = new Px({
  token: env.CLIENT_TOKEN,
  intents: 3276799,
  commands: [new KickCommand(), new BanCommand()],
  // syncCommands: true,
  events: [
    new GuildMemberRemove(),
    gc,
    ga,
    new ChannelUpdate(),
    new ChannelCreate(),
    new ChannelDelete(),
    new RoleCreate(),
    new RoleDelete(),
    new RoleUpdate(),
    new InteractionCreate(),
    new MessageCreate(),
  ],
})

setTimeout(async () => {
  // console.log(muteService.daysToMs(5))
  // await db.exec('DELETE FROM guild_modules')
  // await redis._client.flushAll()
  // await db.exec('INSERT INTO modules (name) VALUES ($1)', ['scanner'])
  // console.log(await db.exec('SELECT * FROM modules'))
  // const res = await scannerService.handleNewMessage({
  //   guild: { id: '974775347553906718' },
  //   content:
  //     'Salut les amis, comment allez vous merde  ?                                                                                                                       ',
  // })
}, 100)
// client.on('error', (e) => console.error(e))
// client.on('warn', (e) => console.warn(e))
// client.on('debug', (e) => console.info(e))
client.exe()
// client.exe().then(async () => {
// const res = await fetch(
//   `${RouteBases.api}/${Routes.applicationGuildCommands(
//     (client as Client<true>).application.id,
//     '974775347553906718'
//   )}`,
//   {
//     method: 'delete',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bot ${env.CLIENT_TOKEN}`,
//     },
// })
// console.log(await res.json())
// })
// setTimeout(async () => {
//   await db.exec('DELETE FROM guild_modules')
//   console.log(await db.exec('SELECT * FROM guild_modules'))
//   await redis._client.flushAll()

// raidCounterService.handleMember({ guild: { id: '974775347553906718' } })
// await raidCounterService.handleMember({ guild: { id: '974775347553906718' } })
// await raidCounterService.handleMember({ guild: { id: '974775347553906718' } })
// await raidCounterService.handleMember({ guild: { id: '974775347553906718' } })
// await raidCounterService.handleMember({ guild: { id: '974775347553906718' } })
// await raidCounterService.handleMember({ guild: { id: '974775347553906718' } })
// await raidCounterService.handleMember({ guild: { id: '974775347553906718' } })
// await raidCounterService.handleMember({ guild: { id: '974775347553906718' } })
// }, 250)

// setTimeout(async () => {
//   await raidCounterService.handleMember({ guild: { id: '974775347553906718' } })
// }, 9000)

// setTimeout(async () => {
//   await raidCounterService.handleMember({ guild: { id: '974775347553906718' } })
// }, 11000)

// setInterval(async () => {
//   console.log(await redis._client.ttl(`raidCounter:974775347553906718`))
// }, 1000)
