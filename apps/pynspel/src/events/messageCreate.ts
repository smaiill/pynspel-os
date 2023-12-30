import { BaseEvent } from '@pynspel/px'
import { Client, Message } from 'discord.js'
import { scannerService } from 'modules/scanner/scanner.service'

export class MessageCreate extends BaseEvent<'messageCreate'> {
  _scannerService = scannerService
  constructor() {
    super('messageCreate')
  }

  public async on(_: Client, message: Message) {
    await this._scannerService.handleNewMessage(message)
  }
}
