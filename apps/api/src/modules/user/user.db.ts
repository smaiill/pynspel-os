import { SavedUser, User } from '@pynspel/types'
import { db } from 'modules/db'

class _UserDB {
  public async createOrUpdate(params: User) {
    const query = `
      INSERT INTO users (discord_id, avatar, username, discriminator, access_token, refresh_token)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (discord_id)
      DO UPDATE SET
        avatar = EXCLUDED.avatar,
        username = EXCLUDED.username,
        discriminator = EXCLUDED.discriminator,
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token
      RETURNING 
        discord_id AS "discordId",
        avatar,
        username,
        discriminator,
        access_token AS "accessToken",
        refresh_token AS "refreshToken";
    `
    const values = [
      params.discordId,
      params.avatar,
      params.username,
      params.discriminator,
      params.accessToken,
      params.refreshToken,
    ]
    const [userDB] = await db.exec<SavedUser>(query, values)

    return userDB
  }
}

export const UserDB = new _UserDB()
