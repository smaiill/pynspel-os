import { HttpStatus } from '@pynspel/types'
import cookieParser from 'cookie-parser'
import { Request, Response } from 'express'
import { AuthService } from 'modules/auth/auth.service'
import { _decrypt } from 'utils/crypto'
import { env } from 'utils/env'
import { HttpException } from 'utils/error'

class _AuthController {
  private authService = AuthService

  public async redirect(req: Request, res: Response) {
    const { code } = req.query

    await this.authService.authenticate({ code: code as string, req })

    res.status(HttpStatus.OK).redirect(env.CORS_ORIGIN)
  }

  public async revoke(req: Request, res: Response) {
    const authCookie = req.cookies[env.AUTH_COOKIE_NAME]

    if (!req.user || !authCookie) {
      throw new HttpException(HttpStatus.UNAUTHORIZED, 'Unauthorized')
    }

    const sessionId = cookieParser
      .signedCookie(authCookie, env.CRYPTION_KEY_SESSION)
      .toString()

    await this.authService.revokeAccess({
      accessToken: _decrypt(req.user.accessToken),
      sessionId,
    })

    req.session.destroy(() => {
      res
        .clearCookie(env.AUTH_COOKIE_NAME)
        .json({ message: 'logout success !' })
    })
  }

  public getAuthenticatedUserController(req: Request, res: Response) {
    if (!req.user) {
      throw new HttpException(HttpStatus.UNAUTHORIZED, 'Unauthorized')
    }

    const { accessToken, refreshToken, ...rest } = req.user // eslint-disable-line

    res.json({ user: { ...rest } })
  }
}

export const AuthController = new _AuthController()
