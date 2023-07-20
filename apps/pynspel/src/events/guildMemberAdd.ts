import { BaseEvent } from '@pynspel/px'
import { db } from '../db/index'
import { ChannelType, Client, Events, GuildMember } from 'discord.js'
import { InferModuleConfigType, Modules } from '@pynspel/common'
import { CaptchaManager } from 'builders/captcha'

export class GuildMemberAdd extends BaseEvent<Events.GuildMemberAdd> {
  private _db = db
  constructor() {
    super(Events.GuildMemberAdd)
  }

  public async on(client: Client, member: GuildMember) {
    this.handleUserVerification(client, member)
  }

  private async handleUserVerification(client: Client, member: GuildMember) {
    const guildId = member.guild.id
    const query = `
      SELECT config
      FROM guild_modules
      JOIN modules ON guild_modules.module_id = modules.module_id
      WHERE guild_id = $1 AND modules.name = $2;
    `

    const [res] = await this._db.exec<{
      config: InferModuleConfigType<(typeof Modules)['captcha']>
    }>(query, [guildId, Modules.captcha])

    if (!res.config.verification_channel) {
      return console.log('Guild has no verification channel')
    }

    const channel = await client.channels.fetch(res.config.verification_channel)

    if (!channel || channel.type !== ChannelType.GuildText) {
      return console.log('Invalid channel')
    }

    const captcha = new CaptchaManager({ ...res.config })
    // Or create it everytime here when user joins
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
