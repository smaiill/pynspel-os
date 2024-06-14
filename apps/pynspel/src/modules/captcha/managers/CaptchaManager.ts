import { createCanvas } from '@napi-rs/canvas'
import { InferModuleConfigType, Modules } from '@pynspel/common'
import { GuildMember, Message, TextChannel } from 'discord.js'
import { logger } from 'utils/logger'
import { captchaEmbeds } from '../captcha.embeds'

export type CaptchaConstructor = {
  width?: number
  height?: number
} & InferModuleConfigType<(typeof Modules)['captcha']>

type CaptchaLengthsObject = Record<
  InferModuleConfigType<(typeof Modules)['captcha']>['length'],
  number
>

const spaces: CaptchaLengthsObject = {
  4: 100,
  6: 50,
  8: 20,
}

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
      width: 350,
      height: 150,
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

    const fontSize = Math.floor(Math.random() * 20) + 30
    const font = `bold ${fontSize}px Arial`
    ctx.font = font

    ctx.fillStyle = color

    const spacesToAdd =
      spaces[
        code.length as InferModuleConfigType<
          (typeof Modules)['captcha']
        >['length']
      ]

    for (let i = 0; i < code.length; i++) {
      const randomRotate = Math.random() * 0.2
      ctx.rotate(randomRotate)
      const x = 40 * i + spacesToAdd
      const y = 15 * (i === 0 ? i + 5 : 5)
      ctx.fillText(code[i], x, y)
      ctx.rotate(-randomRotate)
    }

    this._code = code

    for (let i = 0; i < 200; i++) {
      const { color } = this.randomColor()

      const x = Math.random() * this._options.width
      const y = Math.random() * this._options.height
      const radius = Math.random() * 5

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2, false)
      ctx.fill()
    }

    return { image: canvas.toBuffer('image/png'), code }
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
    await channel
      .awaitMessages({
        max: 1,
        filter: (m) => m.author.id === member.id,
        time: this._options.timeout * 1000,
        errors: ['time'],
      })
      .then(async (m) => {
        if (this._attempts >= this._options.max_retries) {
          const embed = captchaEmbeds.embedMaxRetries(member)

          await member.send({ embeds: [embed] }).catch(logger.log)
          await member.kick('Reached max retries of the captcha.')

          return
        }

        const content = m.at(0)?.content.trim()
        const compared = this.compareCode(content ?? '')

        if (!compared) {
          this.verify({ member, channel, captchaMessage })
          return this._attempts++
        }

        await captchaMessage.delete()

        await channel.send(`✔️ ${member.user} You have passed the checks.`)

        if (this._options.role_id) {
          const role = await member.guild.roles.fetch(this._options.role_id)

          if (!role || role.permissions.has('Administrator')) {
            return
          }

          try {
            await member.roles.add(role)
          } catch (error) {
            await member.send({
              content: `Couldn't give you a role on the ${member.guild.name}, contact the server owner.`,
            })
          }
        }
      })
      .catch(async (error) => {
        logger.error((error as Error).stack)
        await member
          .kick('Reached max retries of the captcha.')
          .catch(() => logger.error((error as Error).stack))
      })
  }
}
