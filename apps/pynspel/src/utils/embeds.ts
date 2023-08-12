import { ClientInformations } from 'constants/pynspel'
import { EmbedBuilder } from 'discord.js'

type EmbedOptions = {
  type: 'success' | 'error'
  message: string
}

export class ReponseEmbed extends EmbedBuilder {
  constructor(private _options: EmbedOptions) {
    super()
    this.setColor(_options.type === 'error' ? 'Red' : 'Green').setDescription(
      _options.message
    )
  }
}
