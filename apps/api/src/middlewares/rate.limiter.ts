import { Errors, HttpStatus } from '@pynspel/types'
import { NextFunction, Request, Response } from 'express'
import { getUserRateLimit } from 'managers/rate.limiter'
import { HttpException } from 'utils/error'
import { redis } from 'utils/redis'

const RATE_LIMITER_OPTIONS = {
  REQUESTS: 100,
  TIME: 5,
  KEY_PREFIX: '__rateLimiter',
} as const

export const rateLimiter = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const userKey = req.user?.discordId ?? req.ip

  if (!redis._client.isReady) {
    throw new HttpException(
      HttpStatus.SERVICE_UNAVAILABLE,
      Errors.E_SERVICE_UNAVAILABLE
    )
  }

  const parsedKey = `${RATE_LIMITER_OPTIONS.KEY_PREFIX}::${userKey}`

  const { exists, value } = await getUserRateLimit(parsedKey)
  const newValue = value + 1

  if (newValue > RATE_LIMITER_OPTIONS.REQUESTS) {
    await redis._client.set(parsedKey, String(newValue), {
      EX: 300,
    })

    throw new HttpException(
      HttpStatus.SERVICE_UNAVAILABLE,
      Errors.E_RATE_LIMITED
    )
  }

  if (exists) {
    await redis._client.set(parsedKey, String(newValue), { KEEPTTL: true })
  } else {
    await redis._client.setEx(
      parsedKey,
      RATE_LIMITER_OPTIONS.TIME,
      String(newValue)
    )
  }

  next()
}
