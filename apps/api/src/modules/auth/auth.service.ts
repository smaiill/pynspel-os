import { HttpStatus, OAuth2TokenResponse } from '@pynspel/types'
import { Routes } from 'discord-api-types/v10'
import { Request } from 'express'
import { db } from 'modules/db'
import { UserDB } from 'modules/user/user.db'
import { UserService } from 'modules/user/user.service'
import { URLSearchParams } from 'url'
import { _encrypt } from 'utils/crypto'
import { discordApi } from 'utils/discord'
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

    const response = await discordApi({
      uri: Routes.oauth2TokenExchange(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
      method: 'POST',
    })

    return response
  }

  private async deleteSessionInDb(sessionId: string) {
    const query = 'DELETE FROM sessions WHERE session_id = $1'

    await db.exec(query, [sessionId])
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

    await discordApi({
      uri: Routes.oauth2TokenRevocation(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
      method: 'POST',
    })

    await this.deleteSessionInDb(sessionId)
  }

  public async authenticate({ code, req }: { code: string; req: Request }) {
    console.log('3')
    if (!code) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Code undefined')
    }
    console.log('4')

    const { access_token, refresh_token } = await this.getCredentialsUsingCode(
      code as unknown as string
    )

    console.log('5')
    const user = await this._userService.getDiscordUser(access_token)

    console.log('6')
    const newUser = await this._userDB.createOrUpdate({
      discordId: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      accessToken: _encrypt(access_token),
      refreshToken: _encrypt(refresh_token),
      email: user.email as string,
    })

    console.log('7')

    await serializeSession(req, newUser)
  }
}

export const AuthService = new _AuthService()
