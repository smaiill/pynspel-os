import { InferModuleConfigType, Modules } from '@pynspel/common'
import { Guild, GuildMember } from 'discord.js'
import { ModuleServiceBase } from 'modules/module.service.base'
import { logger } from 'utils/logger'

type Action = Pick<InferModuleConfigType<'counterRaid'>, 'action'>['action']
type MuteUnit = Pick<
  InferModuleConfigType<'counterRaid'>,
  'mute_unit'
>['mute_unit']

export type TakeAction = {
  member: GuildMember
  config: {
    muteTimeout: number
    muteUnit: MuteUnit
    action: Action
    reason: string | null
  }
}

const daysToMs = (days: number) => days * (1000 * 60 * 60 * 24)

const minutesToMs = (minutes: number) => minutes * (1000 * 60)

export const unitToMs = (unit: MuteUnit, value: number) => {
  if (unit === 'day') {
    return daysToMs(value)
  }
  if (unit === 'minute') {
    return minutesToMs(value)
  }
}

class _RaidCounterService extends ModuleServiceBase<'counterRaid'> {
  private counterRaidCacheKey = 'counterRaid'
  constructor() {
    super(Modules.counterRaid)
  }

  private async getGuildMemberThresholdOrCreate(
    guildId: string,
    interval: number
  ) {
    try {
      const value = await this._cache._client.get(`raidCounter:${guildId}`)

      if (!value) {
        await this._cache._client.setEx(`raidCounter:${guildId}`, interval, '0')

        return 0
      }

      return Number(value)
    } catch (error) {
      logger.error('Error in getGuildMemberThresholdOrCreate:', error)
      return 0
    }
  }

  private async updateGuildMemberThreshold(guildId: string, newValue: number) {
    try {
      await this._cache._client.set(`raidCounter:${guildId}`, newValue, {
        KEEPTTL: true,
      })
      return newValue
    } catch (error) {
      return newValue
    }
  }

  private async takeAction({ config, member }: TakeAction) {
    switch (config.action) {
      case 'ban':
        if (!member.bannable) {
          return
        }
        await member.ban({ reason: config.reason ? config.reason : undefined })
        break
      case 'kick':
        if (!member.kickable) {
          return
        }
        await member.kick(config.reason ? config.reason : undefined)
        break

      case 'mute':
        await member.timeout(
          unitToMs(config.muteUnit, config.muteTimeout) as number
        )
        break
      default:
        break
    }
  }

  public async lockChannels(guild: Guild) {
    const channels = await guild.channels.fetch()

    channels.forEach(async (channel) => {
      try {
        if (channel) {
          await channel.permissionOverwrites.edit(guild.roles.everyone, {
            SendMessages: false,
          })
        }
      } catch (error) {
        logger.error({ channel: channel?.id, guildId: guild.id, error })
      }
    })
  }

  public async handleMember(member: GuildMember) {
    const guildId = member.guild.id
    try {
      const config = await this.getFreshConfigOrCached(guildId)

      const threshold = await this.getGuildMemberThresholdOrCreate(
        guildId,
        config.interval
      )

      if (threshold >= config.member_threshold) {
        await this.takeAction({
          config: {
            action: config.action,
            muteTimeout: config.mute_timeout,
            muteUnit: config.mute_unit,
            reason: config.action_reason,
          },
          member,
        })

        if (config.raid_channel_lockdown) {
          await this.lockChannels(member.guild)
        }

        return false
      }
      const newValue = threshold + 1
      await this.updateGuildMemberThreshold(guildId, newValue)

      return true
    } catch (error) {
      logger.error(error)
      return false
    }
  }
}

export const raidCounterService = new _RaidCounterService()
