import { InferModuleConfigType, Modules } from '@pynspel/common'
import { createCanvas } from 'canvas'
import { GuildMember, Message, TextChannel } from 'discord.js'
import { env } from 'utils/env'

export type CaptchaConstructor = {
  width?: number
  height?: number
} & InferModuleConfigType<(typeof Modules)['captcha']>

export class CaptchaManager {
  private _code: string | null = null
  private _options: Required<CaptchaConstructor>
  private _attempts = 0
  private _numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  private _chars = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ]
  constructor(options: CaptchaConstructor) {
    this._options = {
      ...{ width: 600, height: 300 },
      ...options,
    }
  }

  private randomColor() {
    const r = this.randomIntFromInterval(0, 255)
    const g = this.randomIntFromInterval(0, 255)
    const b = this.randomIntFromInterval(0, 255)
    return { color: `rgb(${r}, ${g}, ${b})`, codes: { r, g, b } }
  }

  private getRandomChar() {
    return this._chars[Math.floor(Math.random() * this._chars.length)]
  }
  private getRandomNumber() {
    return this._numbers[Math.floor(Math.random() * this._numbers.length)]
  }

  private randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  private randomCode() {
    let code = ''
    for (let i = 0; i < this._options.length; i++) {
      const char = this.getRandomChar()
      const upper = this.randomIntFromInterval(0, 1)
      const number =
        this._options.has_numbers && this.randomIntFromInterval(0, 1)
      code += number
        ? this.getRandomNumber()
        : upper
        ? char.toUpperCase()
        : char
    }
    return code
  }

  public create() {
    const canvas = createCanvas(this._options.width, this._options.height)
    const ctx = canvas.getContext('2d')
    const code = this.randomCode()
    const { color, codes } = this.randomColor()

    ctx.fillStyle = `rgb(${255 - codes.r}, ${255 - codes.g}, ${255 - codes.b})`
    ctx.fillRect(0, 0, this._options.width, this._options.height)
    ctx.font = '48px Arial'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(code, this._options.width / 2, this._options.height / 2)
    this._code = code

    for (let i = 0; i < 125; i++) {
      const { color } = this.randomColor()

      const x = Math.random() * this._options.width
      const y = Math.random() * this._options.height
      const radius = Math.random() * 7
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2, false)
      ctx.fill()
    }

    return { image: canvas.toBuffer(), code }
  }

  public compareCode(input: string) {
    const formatedInput = this._options.case_sensitive
      ? input
      : input.toLowerCase()
    const formatedCode = this._options.case_sensitive
      ? this._code
      : this._code?.toLowerCase()

    return formatedInput === formatedCode
  }

  public async verify({
    member,
    captchaMessage,
    channel,
  }: {
    member: GuildMember
    channel: TextChannel
    captchaMessage: Message
  }) {
    console.log({ code: this._code })
    await channel
      .awaitMessages({
        max: 1,
        filter: (m) => m.author.id === member.id,
        time: this._options.timeout * 1000,
        errors: ['time'],
      })
      .then(async (m) => {
        console.log(this._code)

        const content = m.at(0)?.content.trim()
        const compared = this.compareCode(content ?? '')

        console.log({ compared })
        if (!compared) {
          console.log('Not good', { content, code: this._code })
          this.verify({ member, channel, captchaMessage })
          return this._attempts++
        }

        await captchaMessage.delete()
        await channel.send(`All good ${member.user}`)
        if (this._options.role_id) {
          const role = await member.guild.roles.fetch(this._options.role_id)
          if (!role) {
            return
          }

          await member.roles.add(role)
        }
        console.log('Finished')
      })
      .catch((err) => {
        console.log(err)
        console.log('Kick the player timeout !', this._options.timeout * 1000)
      })
  }
}
