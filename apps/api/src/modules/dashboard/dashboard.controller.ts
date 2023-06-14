import { SavedUser } from '@pynspel/types'
import { Request, Response } from 'express'
import { _decrypt } from 'utils/crypto'
import { DashboardService } from './dashboard.service'

class _DashboardController {
  private _dashboardService: typeof DashboardService
  constructor() {
    this._dashboardService = DashboardService
  }

  public async fetchMutualGuilds(req: Request, res: Response) {
    const { user } = req
    const { accessToken } = user as SavedUser

    const guilds = await this._dashboardService.fetchMutualGuilds(
      _decrypt(accessToken)
    )

    res.json(guilds)
  }

  public async fetchGuild(req: Request, res: Response) {
    const { id } = req.params

    const guild = await DashboardService.getGuildConfiguration(id)

    res.json(guild)
  }
}

export const DashboardController = new _DashboardController()
