import { Request, Response } from 'express'
import { CommandModuleService } from './command.service'

class _CommandModuleController {
  private _moduleService = CommandModuleService
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

export const CommandModuleController = new _CommandModuleController()
