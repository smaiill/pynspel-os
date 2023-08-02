import { InferModuleConfigType, Modules, ModulesTypes } from '@pynspel/common'
import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import {
  ChannelType,
  Client,
  GuildMember,
  PartialGuildMember,
} from 'discord.js'
import { redis } from 'utils/redis'

type MemberRemove = GuildMember | PartialGuildMember

export class GuildMemberRemove extends BaseEvent<'guildMemberRemove'> {
  private _db = db
  constructor() {
    super('guildMemberRemove')
  }

  public async on(client: Client, member: MemberRemove) {
    this.handleUserRemoveLog(client, member)
  }

  private async getCachedConfigOrFresh<M extends ModulesTypes>(
    guildId: string,
    moduleName: M
  ) {
    const cache = await redis.getGuidModule(guildId, moduleName)

    if (cache) {
      console.log('Return cache data !')
      return cache
    }

    const res = await this._db.getOrCreateModuleConfigForGuild(
      guildId,
      moduleName
    )

    await redis.setGuildModule(guildId, moduleName, res)

    return res
  }

  private async handleUserRemoveLog(client: Client, member: MemberRemove) {
    const res = await this.getCachedConfigOrFresh(
      member.guild.id,
      Modules.logging
    )

    if (!res.user_left || !res.channel) {
      return console.log('Null channel or desactivated')
    }

    const channel = await client.channels.fetch(res.channel)

    if (!channel) {
      return console.log('Invalid channel')
    }

    if (channel.type !== ChannelType.GuildText) {
      return console.log('Channel is not text')
    }

    channel.send(`User with id ${member.id} has left !`)
  }
}
