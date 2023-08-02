import { BaseEvent } from '@pynspel/px'
import { db } from '../db/index'
import { ChannelType, Client, Events, GuildMember } from 'discord.js'
import { Modules, ModulesTypes } from '@pynspel/common'
import { redis } from 'utils/redis'
import { raidCounterService } from 'modules/raidCounter/raidCounter.service'
import { CaptchaManager } from 'modules/captcha/managers/CaptchaManager'
import { ModuleServiceBase } from 'modules/module.service.base'

const getifferentDaysForDate = (old: Date) => {
  const now = new Date()
  const res = now.getTime() - old.getTime()
  const diff = res / (1000 * 3600 * 24)

  return Math.trunc(diff)
}

const MIN_DAYS_ACCOUNT_CREATION = 30
export class GuildMemberAdd extends BaseEvent<Events.GuildMemberAdd> {
  private _db = db
  private raidCounterService = raidCounterService
  constructor() {
    super(Events.GuildMemberAdd)
  }

  private async handleXVerification(client: Client, member: GuildMember) {
    const createdDays = getifferentDaysForDate(new Date(member.user.createdAt))

    if (createdDays < MIN_DAYS_ACCOUNT_CREATION) {
      return false
    }

    return true
  }

  public async on(client: Client, member: GuildMember) {
    await this.handleUserAddLog(client, member)
    const passed = await this.handleXVerification(client, member)

    if (!passed) {
      await member.kick('Didnt pass the checks')
      return
    }

    const passedRaidCounter = await this.raidCounterService.handleMember(member)
    if (!passedRaidCounter) {
      return
    }
    await this.handleUserVerification(client, member)
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

  private async handleUserAddLog(client: Client, member: GuildMember) {
    const res = await this.getCachedConfigOrFresh(
      member.guild.id,
      Modules.logging
    )

    if (!res.user_join || !res.channel) {
      return console.log('Null channel or desactivated')
    }

    const channel = await client.channels.fetch(res.channel)

    if (!channel) {
      return console.log('Invalid channel')
    }

    if (channel.type !== ChannelType.GuildText) {
      return console.log('Channel is not text')
    }

    channel.send(`User with id ${member.id} has joined !`)
  }

  private async handleUserVerification(client: Client, member: GuildMember) {
    const guildId = member.guild.id

    const res = await this.getCachedConfigOrFresh(guildId, Modules.captcha)

    if (!res.verification_channel) {
      return console.log('Guild has no verification channel')
    }

    const channel = await client.channels.fetch(res.verification_channel)

    if (!channel || channel.type !== ChannelType.GuildText) {
      return console.log('Invalid channel')
    }

    const captcha = new CaptchaManager({ ...res })
    const { image } = captcha.create()

    const captchaMessage = await channel.send({
      files: [
        {
          attachment: image,
          name: 'captcha.jpg',
        },
      ],
    })

    captcha.verify({ member, channel, captchaMessage })
  }
}
