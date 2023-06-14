import { HTTPCode, SavedUser } from '@pynspel/types'
import { Request, Response } from 'express'
import { UserService } from 'modules/user/user.service'
import { _decrypt } from 'utils/crypto'
import { HTTPError } from 'utils/error.handler'

class _UserController {
  private _userService: typeof UserService

  constructor() {
    this._userService = UserService
  }
  public async getDiscordUser(req: Request, res: Response) {
    const { accessToken } = req.user as SavedUser

    const user = await this._userService.getDiscordUser(_decrypt(accessToken))

    if (!user) throw new HTTPError(HTTPCode.NOT_FOUND, 'User not found !')

    res.json({ user })
  }
}

export const UserController = new _UserController()
