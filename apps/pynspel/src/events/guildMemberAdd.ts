import { Modules, ModulesTypes } from '@pynspel/common'
import { BaseEvent } from '@pynspel/px'
import { ChannelType, Client, Events, GuildMember } from 'discord.js'
import { CaptchaManager } from 'modules/captcha/managers/CaptchaManager'
import { raidCounterService } from 'modules/raidCounter/raidCounter.service'
import { redis } from 'utils/redis'
import { db } from '../db/index'
import { loggingService } from 'modules/logging/logging.service'
import { captchaEmbeds } from 'modules/captcha/captcha.embeds'

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
  private loggingService = loggingService
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
    await this.loggingService.guildMemberAdd(member)
    const passed = await this.handleXVerification(client, member)

    if (!passed) {
      await member.kick('Didnt pass the checks')
      return
    }

    const passedRaidCounter = await this.raidCounterService.handleMember(member)

    console.log({ passedRaidCounter, passed })

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

    const { embed } = captchaEmbeds.embedJoin({
      avatarUrl: member.user.displayAvatarURL(),
      guildName: member.guild.name,
      username: member.user.username,
      caseSensitive: res.case_sensitive,
    })

    const message = await channel.send({
      embeds: [embed],
      files: [
        {
          attachment: image,
          name: 'captcha.png',
        },
      ],
    })

    captcha.verify({ member, channel, captchaMessage: message })
  }
}
