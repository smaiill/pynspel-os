import { InferModuleConfigType } from '@pynspel/common'
import { Collection, GuildMember, Invite, Message } from 'discord.js'
import { ModuleServiceBase } from 'modules/module.service.base'
import { unitToMs } from 'modules/raidCounter/raidCounter.service'

type ScanMessageContentResponse =
  | { passed: true }
  | { passed: false; detected: string }

type ScanMessageContentResponseUrls =
  | { passed: true }
  | { passed: false; detected: string[] }

type ScanMessageContent = {
  content: string
  exact: string[]
  nonExact: string[]
}

type ScanMessageLinks = {
  content: string
  allowedDomains: string[]
  invites: Collection<string, Invite>
}

type Action = Pick<InferModuleConfigType<'scanner'>, 'words'>['words']['action']
type MuteUnit = Pick<
  InferModuleConfigType<'scanner'>,
  'words'
>['words']['mute_unit']

export type TakeAction = {
  member: GuildMember
  config: {
    muteTimeout: number
    muteUnit: MuteUnit
    action: Action
    reason: string | null
  }
}

class _ScannerService extends ModuleServiceBase<'scanner'> {
  private REGEX_URL = /(?:https?:\/\/|www\.|discord\.gg\/)\S+\b/g
  private REGEX_EXTRACT_DISCORD_INVITE = /discord\.gg\/([a-zA-Z0-9_-]+)/g

  constructor() {
    super('scanner')
  }

  public async scanMessageWords({
    content,
    nonExact,
    exact,
  }: ScanMessageContent): Promise<ScanMessageContentResponse> {
    const splitedContent = content.split(' ')

    for (const exactWord of exact) {
      if (splitedContent.includes(exactWord)) {
        return { passed: false, detected: exactWord }
      }
    }

    for (const nonExactWord of nonExact) {
      if (content.includes(nonExactWord)) {
        return { passed: false, detected: nonExactWord }
      }
    }

    return { passed: true }
  }

  private async scanMessageLinks({
    content,
    allowedDomains,
    invites,
  }: ScanMessageLinks): Promise<ScanMessageContentResponseUrls> {
    const matchedUrls = content.match(this.REGEX_URL)
    const extractedInvites = content.match(this.REGEX_EXTRACT_DISCORD_INVITE)

    if (!matchedUrls) {
      return { passed: true }
    }

    if (extractedInvites) {
      for (let i = extractedInvites.length - 1; i >= 0; i--) {
        const invite = extractedInvites[i].split('/')[1]

        if (invites.has(invite)) {
          extractedInvites.splice(i, 1)
        }
      }

      if (extractedInvites.length === 0) {
        return { passed: true }
      }
    }

    const joinUrls = matchedUrls.join(' ')
    let allowedDomainsInMatched = 0

    for (const domain of allowedDomains) {
      if (joinUrls.includes(domain)) {
        allowedDomainsInMatched += 1
      }
    }

    if (allowedDomainsInMatched !== matchedUrls.length) {
      return { passed: false, detected: matchedUrls }
    }

    return { passed: true }
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
  public async handleNewMessage(
    message: Message
  ): Promise<{ passed: boolean }> {
    if (!message.guild || message.author.bot || !message.member) {
      return { passed: true }
    }

    const guildId = message.guild.id

    const { words, links } = await this.getFreshConfigOrCached(guildId)

    const content = message.content.trim()

    if (links.scan) {
      const scannedContentLinks = await this.scanMessageLinks({
        content,
        allowedDomains: links.allowed_domains,
        invites: await message.guild.invites.fetch(),
      })

      if (!scannedContentLinks.passed) {
        if (!links.ignored_channels.includes(message?.channel?.id)) {
          await Promise.allSettled([
            message.delete(),
            message.channel.send({
              embeds: [
                {
                  description: `${message.member}, Your message was delete cause of a link detected.`,
                },
              ],
            }),
          ])

          await this.takeAction({
            config: {
              action: links.action,
              muteTimeout: links.mute_timeout,
              muteUnit: links.mute_unit,
              reason: 'Sending links.',
            },
            member: message.member,
          })

          return { ...scannedContentLinks }
        }
      }
    }

    if (words.scan) {
      const scannedContent = await this.scanMessageWords({
        content: message.content,
        exact: words.banned_exact,
        nonExact: words.banned,
      })

      if (!scannedContent.passed) {
        if (!words.ignored_channels.includes(message?.channel?.id)) {
          await Promise.allSettled([
            message.delete(),
            message.channel.send({
              embeds: [
                {
                  description: `${message.member}, Your message was delete cause of a bad word: ||${scannedContent.detected}||`,
                },
              ],
            }),
          ])

          await this.takeAction({
            config: {
              action: words.action,
              muteTimeout: words.mute_timeout,
              muteUnit: words.mute_unit,
              reason: 'Sending bad words.',
            },
            member: message.member,
          })
          return { ...scannedContent }
        }
      }
    }

    return { passed: true }
  }
}

export const scannerService = new _ScannerService()
