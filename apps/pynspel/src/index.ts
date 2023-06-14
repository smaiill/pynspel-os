import { Px } from '@pynspel/px'
import { Guild } from 'discord.js'
import { pool } from 'utils/db'
import { env } from 'utils/env'
import 'utils/load.env'

const client = new Px({
  token: env.CLIENT_TOKEN,
  intents: 3276799,
  logger: true,
})

client.on('guildCreate', async (guild: Guild) => {
  const query = 'INSERT INTO guilds (guild_id) VALUES ($1)'
  const values = [guild.id]

  await pool?.query(query, values)
})

// client.exe()
