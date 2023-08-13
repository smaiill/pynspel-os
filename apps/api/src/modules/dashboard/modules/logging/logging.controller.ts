import { HttpStatus } from '@pynspel/types'
import { Request, Response } from 'express'
import { DashboardService } from 'modules/dashboard/dashboard.service'
import { HttpException } from 'utils/error'
import { LoggingModuleService } from './logging.service'

class _LoggingModuleController {
  private _moduleService = LoggingModuleService
  public async getConfig(req: Request, res: Response) {
    const { guildId } = req.params

    if (!guildId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid guild id')
    }

    const _res = await this._moduleService.get(guildId)

    res.json(_res)
  }

  public async updateConfig(req: Request, res: Response) {
    const { guildId } = req.params

    if (!guildId || !req.body) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Invalid guild id or config'
      )
    }

    const guildChannels = await DashboardService.getCachedChannelsOrFresh(
      guildId
    )

    const validChannel = guildChannels.find(
      (_channel) => _channel.id === req.body.channel
    )

    if (!validChannel) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Not a valid channel or role.'
      )
    }

    const updatedConfig = await this._moduleService.update({
      guildId: guildId,
      newConfig: req.body,
    })

    res.json(updatedConfig)
  }
}

export const LoggingModuleController = new _LoggingModuleController()
