import { HttpStatus, SavedUser } from '@pynspel/types'
import { Request, Response } from 'express'
import { IS_CLIENT_AVAILABLE } from 'managers/websocket'
import { _decrypt } from 'utils/crypto'
import { HttpException } from 'utils/error'
import { DashboardService } from './dashboard.service'

class _DashboardController {
  private _dashboardService: typeof DashboardService
  constructor() {
    this._dashboardService = DashboardService
  }

  public async fetchMutualGuilds(req: Request, res: Response) {
    if (!IS_CLIENT_AVAILABLE) {
      throw new HttpException(
        HttpStatus.SERVICE_UNAVAILABLE,
        'Client is corrently unavailabl'
      )
    }
    const { user } = req
    const { accessToken } = user as SavedUser

    const guilds = await this._dashboardService.fetchMutualGuilds(
      _decrypt(accessToken)
    )

    res.json(guilds)
  }

  public async fetchGuild(req: Request, res: Response) {
    if (!IS_CLIENT_AVAILABLE) {
      throw new HttpException(
        HttpStatus.SERVICE_UNAVAILABLE,
        'Client is corrently unavailabl'
      )
    }
    const { id } = req.params

    if (!id) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid ID')
    }

    const guild = await this._dashboardService.getGuildConfiguration(id)

    res.json(guild)
  }
}

export const DashboardController = new _DashboardController()
