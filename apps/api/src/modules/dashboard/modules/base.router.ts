import { ModulesTypes } from '@pynspel/common'
import { Errors, HttpStatus } from '@pynspel/types'
import { NextFunction, Request, Response, Router } from 'express'
import { db } from 'modules/db'
import { _decrypt } from 'utils/crypto'
import { HttpCantAccesGuildException, HttpException } from 'utils/error'
import { DashboardService } from '../dashboard.service'

type ModuleRouterCreate<M extends ModulesTypes> = {
  get: (req: Request, res: Response, next: NextFunction) => Promise<void>
  put: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export class ModuleRouter<M extends ModulesTypes> {
  private _router: Router
  constructor({ get, put }: ModuleRouterCreate<M>) {
    this._router = Router()
    this._router.get(
      '/:guildId',
      this.validateGuildIdInParams,
      this.userHasPermsAndClientInGuild,
      get
    )
    this._router.put(
      '/:guildId',
      this.validateGuildIdInParams,
      this.userHasPermsAndClientInGuild,
      put
    )
  }

  private async validateGuildIdInParams(
    request: Request,
    _: Response,
    next: NextFunction
  ) {
    const { guildId } = request.params

    if (!guildId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_GUILD_ID)
    }

    next()
  }

  private async userHasPermsAndClientInGuild(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const guildId = req.params.guildId

    const clientInGuild = await db.isClientInGuild(guildId)

    if (!clientInGuild) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_GUILD_ID)
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    next()
  }

  public use(...handlers: any) {
    this._router.use(...handlers)
  }

  public get(
    path: string,
    handler: (req: Request, res: Response, next: NextFunction) => void
  ): void {
    this._router.get(path, handler)
  }

  public post(
    path: string,
    handler: (req: Request, res: Response, next: NextFunction) => void
  ): void {
    this._router.post(path, handler)
  }

  public put(
    path: string,
    handler: (req: Request, res: Response, next: NextFunction) => void
  ): void {
    this._router.put(path, handler)
  }

  public delete(
    path: string,
    handler: (req: Request, res: Response, next: NextFunction) => void
  ): void {
    this._router.delete(path, handler)
  }

  get router() {
    return this._router
  }
}
