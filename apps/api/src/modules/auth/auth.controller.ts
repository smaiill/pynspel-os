import { HTTPCode } from '@pynspel/types'
import { Request, Response } from 'express'
import { AuthService } from 'modules/auth/auth.service'
import { env } from 'utils/env'
import { ErrorType, HTTPError } from 'utils/error.handler'
import { lg } from 'utils/logger'

class _AuthController {
  private authService = AuthService

  public async redirect(req: Request, res: Response) {
    const { code } = req.query

    try {
      await this.authService.authenticate({ code: code as string, req })

      res.status(HTTPCode.OK).redirect(env.CORS_ORIGIN)
    } catch (error) {
      lg.error(error)

      throw new HTTPError(HTTPCode.SERVER_ERROR, error as ErrorType)
    }
  }

  public async revoke(req: Request, res: Response) {
    if (!req.user) {
      throw new HTTPError(HTTPCode.UNAUTHORIZED, 'Unauthorized')
    }

    try {
      await this.authService.revokeAccess(req.user.accessToken)

      res.status(HTTPCode.OK)
    } catch (err) {
      lg.error(err)
      throw new HTTPError(HTTPCode.BAD_REQUEST, err as ErrorType)
    }
  }

  public getAuthenticatedUserController(req: Request, res: Response) {
    if (!req.user) {
      throw new HTTPError(HTTPCode.UNAUTHORIZED, 'Unauthorized')
    }

    const { accessToken, refreshToken, ...rest } = req.user // eslint-disable-line

    res.json({ user: { ...rest } })
  }
}

export const AuthController = new _AuthController()
