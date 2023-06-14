import { HTTPCodes } from '@pynspel/types'
import { NextFunction, Request, Response } from 'express'

export type ErrorMessageType = string | { message: string }
export type ErrorType = ErrorMessageType

export class HTTPError extends Error {
  code: HTTPCodes

  constructor(code: HTTPCodes, message: ErrorMessageType) {
    super(typeof message === 'string' ? message : message.message)
    this.code = code
  }
}

export const errorHandler = (
  err: HTTPError | Error,
  _: Request,
  res: Response,
  __: NextFunction // eslint-disable-line
) => {
  console.log(err)
  if (err instanceof HTTPError) {
    res.status(err.code).json({ error: err.message })
  } else {
    res.status(500).json({ error: 'Internal server error' })
  }
}
