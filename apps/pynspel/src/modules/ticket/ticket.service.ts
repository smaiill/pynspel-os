import {
  ActionRow,
  Embed,
  MessageActionRowComponent,
  TextChannel,
} from 'discord.js'
import { ModuleServiceBase } from 'modules/module.service.base'
import { env } from 'utils/env'

const MAX_MESSAGES_TO_TRANSPILE = 99

export type TranspileMessage = {
  author: string
  content: string
  timestamp: number
  embeds: Embed[]
  authorImage: string | null
  isBot: boolean
  components: ActionRow<MessageActionRowComponent>[]
  id: string
}

export type TranspileMetadata = {
  guild: {
    name: string
    icon: string | null
  }
  length: number
  channel: {
    name: string
  }
}
class _TicketService extends ModuleServiceBase<'ticket'> {
  constructor() {
    super('ticket')
  }
  public async transpileFromChannel(channel: TextChannel) {
    const messages = await channel.messages.fetch({
      limit: MAX_MESSAGES_TO_TRANSPILE,
    })

    const metadata = {
      guild: {
        name: channel.guild.name,
        icon: channel.guild.iconURL(),
      },
      length: messages.size,
      channel: {
        name: channel.name,
      },
    }

    const messageList = messages
      .map((message) => {
        return {
          author: message.author.username,
          content: message.content,
          timestamp: message.createdTimestamp,
          embeds: message.embeds,
          authorImage: message.author.avatarURL(),
          isBot: message.author.bot,
          components: message.components,
          id: message.id,
        }
      })
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )

    const html = this.generateHTML(messageList, metadata)

    return html
  }

  private async generateHTML(
    messages: TranspileMessage[],
    metadata: TranspileMetadata
  ) {
    const cssLink =
      env.NODE_ENV === 'developement'
        ? 'http://localhost:3005/static/transpile/index.min.css'
        : ''
    const jsLink =
      env.NODE_ENV === 'developement'
        ? 'http://localhost:3005/static/transpile/index.min.js'
        : ''
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="${cssLink}">
    </head>
    <body>
      <div id="metadata"></div>
      <div id="messages"></div>

      
    <script src="${jsLink}"></script>
    <script>
      load(${JSON.stringify(messages)}, ${JSON.stringify(metadata)})
    </script>
    </body>
    </html>
    `
  }
}

export const TicketService = new _TicketService()
