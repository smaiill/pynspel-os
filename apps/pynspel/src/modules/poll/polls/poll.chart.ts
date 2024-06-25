import { Canvas, SKRSContext2D, createCanvas } from '@napi-rs/canvas'

type PollsChartOptions = {
  width: number
  height: number
  barWidth: number
  barSpacing: number
  margin: number
  payload: Record<PropertyKey, number>
}

export class PollsChart {
  private canvas: Canvas
  private ctx: SKRSContext2D
  private buffer: Buffer | null = null
  constructor(private options: PollsChartOptions) {
    this.canvas = createCanvas(this.options.width, this.options.height)
    this.ctx = this.canvas.getContext('2d')
    this.draw()
  }

  private draw() {
    const maxVotes = Math.max(...Object.values(this.options.payload))

    const totalBarsWidth =
      Object.keys(this.options.payload).length * this.options.barWidth
    const totalSpacingWidth =
      (Object.keys(this.options.payload).length - 1) * this.options.barSpacing
    const totalWidth = totalBarsWidth + totalSpacingWidth

    const startX = (this.options.width - totalWidth) / 2

    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, this.options.width, this.options.height)

    const choices = Object.keys(this.options.payload)
    choices.forEach((choice, index) => {
      const voteCount = this.options.payload[choice]
      const barHeight =
        (voteCount / maxVotes) * (this.options.height - 2 * this.options.margin)

      this.ctx.fillStyle = 'rgba(54, 162, 235, 0.7)'
      const xPosition =
        startX + index * (this.options.barWidth + this.options.barSpacing)
      this.ctx.fillRect(
        xPosition,
        this.options.height - this.options.margin - barHeight,
        this.options.barWidth,
        barHeight
      )

      this.ctx.fillStyle = '#000000'
      this.ctx.font = '16px Arial'
      this.ctx.fillText(
        (parseInt(choice) + 1).toString(),
        xPosition +
          this.options.barWidth / 2 -
          this.ctx.measureText(choice).width / 2,
        this.options.height - this.options.margin + 20
      )

      this.ctx.fillText(
        voteCount.toString(),
        xPosition +
          this.options.barWidth / 2 -
          this.ctx.measureText(voteCount.toString()).width / 2,
        this.options.height - this.options.margin - barHeight - 10
      )
    })

    this.buffer = this.canvas.toBuffer('image/png')
  }

  public getBuffer() {
    return this.buffer
  }
}
