import { HttpStatus } from '@pynspel/types'
import { Request, Response } from 'express'
import { HttpException } from 'utils/error.handler'
import { CaptchaModuleService } from './captcha.service'

class _CaptchaModuleController {
  private _moduleService = CaptchaModuleService
  public async getConfig(req: Request, res: Response) {
    const { guildId } = req.params

    if (!guildId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid guild id')
    }

    const _res = await this._moduleService.get(guildId)

    res.json({ captcha_module: _res })
  }

  public async updateConfig(req: Request, res: Response) {
    const { guildId } = req.params
    const { config } = req.body

    if (!guildId || !config) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Invalid guild id or config'
      )
    }

    const updatedConfig = await this._moduleService.update({
      guildId: guildId,
      newConfig: config,
    })

    res.json({ captcha_module: updatedConfig })
  }
}

export const CaptchaModuleController = new _CaptchaModuleController()
