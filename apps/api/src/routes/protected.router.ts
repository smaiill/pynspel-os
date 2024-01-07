import { Errors, HttpStatus } from '@pynspel/types'
import { NextFunction, Request, Response, Router } from 'express'
import { HttpException } from 'utils/error'
import { lg } from 'utils/logger'

export class ProtectedRouter {
  private _router: Router
  constructor() {
    this._router = Router()

    this._router.use((req: Request, _, next) => {
      if (!req.user) {
        lg.warn('Not connected with protected router !')
        throw new HttpException(HttpStatus.UNAUTHORIZED, Errors.E_UNAUTHORIZED)
      }
      next()
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
