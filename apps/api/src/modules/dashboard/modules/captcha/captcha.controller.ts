import { HttpStatus } from '@pynspel/types'
import { Request, Response } from 'express'
import { HttpException } from 'utils/error'
import { CaptchaModuleService } from './captcha.service'
import { DashboardService } from 'modules/dashboard/dashboard.service'

class _CaptchaModuleController {
  private _moduleService = CaptchaModuleService
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
    // TODO: Check if the user and the bot have access to the guild.

    const guildChannels = await DashboardService.getCachedChannelsOrFresh(
      guildId
    )

    const guildRoles = await DashboardService.getCachedRolesOrFresh(guildId)

    const validRole = guildRoles.find(
      (_role) => _role.id === req.body.role_id && _role.id !== guildId
    )

    const validChannel = guildChannels.find(
      (_channel) => _channel.id === req.body.verification_channel
    )

    if (!validRole || !validChannel) {
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

export const CaptchaModuleController = new _CaptchaModuleController()
