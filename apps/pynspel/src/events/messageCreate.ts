import { BaseEvent } from '@pynspel/px'
import {
  Attachment,
  AttachmentBuilder,
  Client,
  Message,
  TextChannel,
} from 'discord.js'
import { scannerService } from 'modules/scanner/scanner.service'
import { TicketService } from 'modules/ticket/ticket.service'

export class MessageCreate extends BaseEvent<'messageCreate'> {
  _scannerService = scannerService
  constructor() {
    super('messageCreate')
  }

  public async on(client: Client, message: Message) {
    const { passed } = await this._scannerService.handleNewMessage(message)

    if (!passed) {
      return
    }
  }
}
