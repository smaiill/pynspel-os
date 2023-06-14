import { NextFunction, Request, Response } from 'express'

export const customHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader('X-Powered-By', 'Pynspel')

  next()
}
