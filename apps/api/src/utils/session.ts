import { SavedUser } from '@pynspel/types'
import cookieParser from 'cookie-parser'
import { NextFunction, Request, Response } from 'express'
import { db } from 'modules/db'
import { env } from './env'

interface SessionData {
  session_id: string
  expires_at: Date
  data: SavedUser
}

export const serializeSession = async (
  req: Request,
  user: SavedUser
): Promise<SessionData | undefined> => {
  req.session.user = user
  req.user = user

  console.log('8')
  const query = `
    INSERT INTO sessions (session_id, expires_at, data)
    VALUES ($1, $2, $3)
    RETURNING *;
  `

  const values = [
    req.sessionID,
    req.session.cookie.expires,
    JSON.stringify(user),
  ]

  const [session] = await db.exec<SessionData>(query, values)
  console.log('9')
  return session
}

export const deserializeSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authCookie = req.cookies[env.AUTH_COOKIE_NAME]

  if (!authCookie) {
    req.user = undefined
    return next()
  }

  const sessionId = cookieParser
    .signedCookie(authCookie, env.CRYPTION_KEY_SESSION)
    .toString()

  const sessionQuery = 'SELECT * FROM sessions WHERE session_id = $1'
  const sessionValues = [sessionId]
  const [sessionDB] = await db.exec<SessionData>(sessionQuery, sessionValues)

  if (!sessionDB) {
    req.user = undefined
    return next()
  }

  const currentTime = new Date()

  if (sessionDB.expires_at < currentTime) {
    const deleteQuery = 'DELETE FROM sessions WHERE session_id = $1;'
    const deleteValues = [sessionId]
    req.user = undefined
    await db.exec(deleteQuery, deleteValues)
  } else {
    const data = sessionDB.data
    req.user = data
  }

  next()
}
