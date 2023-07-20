import { SavedUser } from '@pynspel/types'
import cookieParser from 'cookie-parser'
import { NextFunction, Request, Response } from 'express'
import { env } from './env'
import { lg } from './logger'
import { db } from 'modules/db'

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

  return session
}

export const deserializeSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authCookie = req.cookies[env.AUTH_COOKIE_NAME]

  if (!authCookie) {
    return next()
  }

  const sessionId = cookieParser
    .signedCookie(authCookie, env.CRYPTION_KEY_SESSION)
    .toString()

  const sessionQuery = 'SELECT * FROM sessions WHERE session_id = $1;'
  const sessionValues = [sessionId]
  const [sessionDB] = await db.exec<SessionData>(sessionQuery, sessionValues)
  if (!sessionDB) {
    console.log('No Session')
    return next()
  }

  const currentTime = new Date()

  if (sessionDB.expires_at < currentTime) {
    console.log('Session Expired')

    const deleteQuery = 'DELETE FROM sessions WHERE session_id = $1;'
    const deleteValues = [sessionId]
    await db.exec(deleteQuery, deleteValues)

    lg.info(`Session ${sessionId} has expired and deleted`)
  } else {
    const data = sessionDB.data
    req.user = data
  }

  next()
}
