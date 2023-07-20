import { HTTPCodes } from '@pynspel/types'
import { NextFunction, Request, Response } from 'express'
import { lg } from './logger'

export type ErrorMessageType = string | { message: string }
export type ErrorType = ErrorMessageType

export class HttpException extends Error {
  code: HTTPCodes

  constructor(code: HTTPCodes, message: ErrorMessageType) {
    super(typeof message === 'string' ? message : message.message)
    this.code = code
  }
}

export const errorHandler = (
  err: HttpException | Error,
  _: Request,
  res: Response,
  __: NextFunction // eslint-disable-line
) => {
  lg.error(err)
  if (err instanceof HttpException) {
    res.status(err.code).json({ error: err.message })
  } else {
    res.status(500).json({ error: 'Internal server error' })
  }
}
