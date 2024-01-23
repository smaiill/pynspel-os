import { Errors, HttpStatus } from '@pynspel/types'
import { NextFunction, Request, Response } from 'express'
import { HttpException } from 'utils/error'
import { redis } from 'utils/redis'

const RATE_LIMITER_OPTIONS = {
  REQUESTS: 50,
  TIME: 5,
  KEY_PREFIX: '__rateLimiter',
} as const

export const rateLimiter = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const userKey = req.user?.discordId ?? req.ip
  const parsedKey = `${RATE_LIMITER_OPTIONS.KEY_PREFIX}::${userKey}`

  if (!redis._client.isReady) {
    throw new HttpException(
      HttpStatus.SERVICE_UNAVAILABLE,
      Errors.E_SERVICE_UNAVAILABLE
    )
  }

  const newValue = await redis._client.incr(parsedKey)

  if (newValue > RATE_LIMITER_OPTIONS.REQUESTS) {
    throw new HttpException(
      HttpStatus.SERVICE_UNAVAILABLE,
      Errors.E_RATE_LIMITED
    )
  }

  if (newValue === 1) {
    // Set the expiration time for the key
    await redis._client.expire(parsedKey, RATE_LIMITER_OPTIONS.TIME)
  }

  next()
}
