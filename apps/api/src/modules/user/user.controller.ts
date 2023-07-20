import { HttpStatus, SavedUser } from '@pynspel/types'
import { Request, Response } from 'express'
import { UserService } from 'modules/user/user.service'
import { _decrypt } from 'utils/crypto'
import { HttpException } from 'utils/error.handler'

class _UserController {
  private _userService: typeof UserService

  constructor() {
    this._userService = UserService
  }
  public async getDiscordUser(req: Request, res: Response) {
    const { accessToken, discordId } = req.user as SavedUser

    const user = await this._userService.getDiscordUser(
      _decrypt(accessToken),
      discordId
    )

    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, 'User not found !')

    res.json({ user })
  }
}

export const UserController = new _UserController()
