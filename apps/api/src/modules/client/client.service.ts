import { DiscordGuild } from '@pynspel/types'
import { db } from 'modules/db'

class _ClientService {
  public async getMutualGuilds(clientGuilds: DiscordGuild[]) {
    const mutualGuilds = []
    for (const guild of clientGuilds) {
      const clientInGuild = await db.isClientInGuild(guild.id)

      if (clientInGuild) {
        mutualGuilds.push(guild)
      }
    }

    return mutualGuilds
  }
}

export const clientService = new _ClientService()
