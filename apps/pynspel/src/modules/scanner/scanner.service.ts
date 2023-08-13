import { Message } from 'discord.js'
import { ModuleServiceBase } from 'modules/module.service.base'

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
}
class _ScannerService extends ModuleServiceBase<'scanner'> {
  private REGEX_URL = /(?:https?:\/\/|www\.|discord\.gg\/)\S+\b/g
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
  }: ScanMessageLinks): Promise<ScanMessageContentResponseUrls> {
    // TODO: Detect if the invite link is a link ih the guild and pass it.
    const matchedUrls = content.match(this.REGEX_URL)

    if (!matchedUrls) {
      return { passed: true }
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

  public async handleNewMessage(
    message: Message
  ): Promise<{ passed: boolean }> {
    if (!message.guild || message.author.bot) {
      return { passed: true }
    }

    const guildId = message.guild.id

    const { words, links } = await this.getFreshConfigOrCached(guildId)

    const content = message.content.trim()

    if (links.scan) {
      const scannedContentLinks = await this.scanMessageLinks({
        content,
        allowedDomains: links.allowed_domains,
      })

      if (!scannedContentLinks.passed) {
        if (!links.ignored_channels.includes(message?.channel?.id)) {
          await message.delete()
          await message.channel.send({
            embeds: [
              {
                description: `${message.member}, Your message was delete cause of a link detected.`,
              },
            ],
          })
          // TODO: Perform the action in case.

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
          await message.delete()
          await message.channel.send({
            embeds: [
              {
                description: `${message.member}, Your message was delete cause of a bad word: ||${scannedContent.detected}||`,
              },
            ],
          })
          // TODO: Perform the action in case.

          return { ...scannedContent }
        }
      }
    }

    return { passed: true }
  }
}

export const scannerService = new _ScannerService()
