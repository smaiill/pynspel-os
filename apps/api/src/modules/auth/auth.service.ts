import { HttpStatus, OAuth2TokenResponse } from '@pynspel/types'
import { Request } from 'express'
import { db } from 'modules/db'
import { UserDB } from 'modules/user/user.db'
import { UserService } from 'modules/user/user.service'
import { URLSearchParams } from 'url'
import { DiscordRoutes } from 'utils/constants'
import { _encrypt } from 'utils/crypto'
import { env } from 'utils/env'
import { HttpException } from 'utils/error'
import { serializeSession } from 'utils/session'

class _AuthService {
  private _userService = UserService
  private _userDB = UserDB

  public async getCredentialsUsingCode(
    code: string
  ): Promise<OAuth2TokenResponse> {
    const body = new URLSearchParams({
      client_id: env.DISCORD_OAUTH_CLIENT_ID,
      client_secret: env.DISCORD_OAUTH_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: env.DISCORD_REDIRECT_URL,
      code: code.toString(),
    }).toString()

    const res = await fetch(DiscordRoutes.OAUTH2_TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    return await res.json()
  }

  private async deleteSessionInDb(sessionId: string) {
    const query = 'DELETE FROM sessions WHERE session_id = $1'

    const res = await db.exec(query, [sessionId])

    console.log(res)
  }

  public async revokeAccess({
    accessToken,
    sessionId,
  }: {
    accessToken: string
    sessionId: string
  }) {
    const body = new URLSearchParams({
      client_id: env.DISCORD_OAUTH_CLIENT_ID,
      client_secret: env.DISCORD_OAUTH_SECRET,
      token: accessToken,
    }).toString()

    await fetch(DiscordRoutes.OAUTH2_REVOKE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    await this.deleteSessionInDb(sessionId)
  }

  public async authenticate({ code, req }: { code: string; req: Request }) {
    if (!code) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Code undefined')
    }

    const { access_token, refresh_token } = await this.getCredentialsUsingCode(
      code as unknown as string
    )

    const user = await this._userService.getDiscordUser(access_token)

    const newUser = await this._userDB.createOrUpdate({
      discordId: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      accessToken: _encrypt(access_token),
      refreshToken: _encrypt(refresh_token),
    })

    await serializeSession(req, newUser)
  }
}

export const AuthService = new _AuthService()
