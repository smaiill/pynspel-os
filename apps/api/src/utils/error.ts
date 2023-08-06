import { HTTPCodes, HttpStatus } from '@pynspel/types'
import { NextFunction, Request, Response } from 'express'
import { ZodIssue } from 'zod'
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

export class HttpZodValidationError extends Error {
  issues: ZodIssue[]

  constructor(message: ErrorMessageType, issues: ZodIssue[]) {
    super(typeof message === 'string' ? message : message.message)
    this.issues = issues
  }
}

export const errorHandler = (
  err: HttpException | HttpZodValidationError | Error,
  _: Request,
  res: Response,
  __: NextFunction // eslint-disable-line
) => {
  lg.error({ message: err.message, name: err.name, cause: err.cause })

  if (err instanceof HttpException) {
    res.status(err.code).json({ message: err.message })
  } else if (err instanceof HttpZodValidationError) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: err.message, issues: err.issues })
  } else {
    res
      .status(HttpStatus.SERVER_ERROR)
      .json({ message: 'Internal server error' })
  }
}
