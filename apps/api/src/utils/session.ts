import { SavedUser } from '@pynspel/types'
import cookieParser from 'cookie-parser'
import { NextFunction, Request, Response } from 'express'
import { pool } from '../modules/db/pool'
import { env } from './env'
import { lg } from './logger'

interface SessionData {
  session_id: string
  expires_at: Date
  data: string
}

export const serializeSession = async (
  req: Request,
  user: SavedUser
): Promise<SessionData | undefined> => {
  console.log({ serealizedUser: user })
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

  const result = await pool?.query<SessionData>(query, values)
  const session = result?.rows[0]

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
  const sessionResult = await pool?.query<SessionData>(
    sessionQuery,
    sessionValues
  )
  const sessionDB = sessionResult?.rows[0]

  if (!sessionDB) {
    console.log('No Session')
    return next()
  }

  const currentTime = new Date()

  if (sessionDB.expires_at < currentTime) {
    console.log('Session Expired')

    const deleteQuery = 'DELETE FROM sessions WHERE session_id = $1;'
    const deleteValues = [sessionId]
    await pool?.query(deleteQuery, deleteValues)

    lg.info(`Session ${sessionId} has expired and deleted`)
  } else {
    const data = JSON.parse(sessionDB.data)
    req.user = data
  }

  next()
}
