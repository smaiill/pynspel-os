import { Errors, HTTPCodes, HttpStatus } from '@pynspel/types'
import { NextFunction, Request, Response } from 'express'
import { ZodIssue } from 'zod'
import { IS_DEV } from '../constants'
import { lg } from './logger'

export type ErrorMessageType = string | { message: string }
export type ErrorType = ErrorMessageType

export class HttpException extends Error {
  code: HTTPCodes

  constructor(httpCode: HTTPCodes, customCode: string) {
    super(customCode)
    this.code = httpCode
  }
}

export class HttpZodValidationError extends Error {
  issues: ZodIssue[]

  constructor(issues: ZodIssue[]) {
    super()
    this.issues = issues
  }
}

export class HttpCantAccesGuildException extends HttpException {
  constructor() {
    super(HttpStatus.FORBIDDEN, Errors.E_CANT_ACCESS_GUILD)
  }
}

export const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction // eslint-disable-line
) => {
  if (IS_DEV) {
    console.log({ message: err.message, name: err.name, cause: err.cause })
  }

  if (err instanceof HttpException) {
    res.status(err.code).json({ code: err.message })
  } else if (err instanceof HttpZodValidationError) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ code: Errors.E_VALIDATION_ERROR, issues: err.issues })
  } else {
    lg.error({ message: err.message, name: err.name, cause: err.cause })
    res.status(HttpStatus.SERVER_ERROR).json({
      code: Errors.E_SERVICE_UNAVAILABLE,
      message: 'Internal server error',
    })
  }
}
