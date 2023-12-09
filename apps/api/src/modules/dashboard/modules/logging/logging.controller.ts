import { Request, Response } from 'express'
import { LoggingModuleService } from './logging.service'

class _LoggingModuleController {
  private _moduleService = LoggingModuleService
  public async get(req: Request, res: Response) {
    const _res = await this._moduleService.get(req.params.guildId)

    res.json(_res)
  }

  public async update(req: Request, res: Response) {
    const updatedConfig = await this._moduleService.update({
      guildId: req.params.guildId,
      newConfig: req.body,
    })

    res.json(updatedConfig)
  }
}

export const LoggingModuleController = new _LoggingModuleController()
