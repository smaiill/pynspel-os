import { NextFunction, Request, Response, Router } from 'express'

type ModuleRouterCreate = {
  get: (req: Request, res: Response, next: NextFunction) => Promise<void>
  put: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export class ModuleRouter {
  private _router: Router
  constructor({ get, put }: ModuleRouterCreate) {
    this._router = Router()
    this._router.get('/:guildId', get)
    this._router.put('/:guildId', put)
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
