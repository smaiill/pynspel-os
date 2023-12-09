import { Request, Response } from 'express'
import { TicketModuleService } from './ticket.service'

class _TicketModuleController {
  private _moduleService = TicketModuleService
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

export const ticketModuleController = new _TicketModuleController()
