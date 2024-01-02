import { HttpStatus } from '@pynspel/types'
import { Request, Response } from 'express'

export const disabled = (_: Request, res: Response) => {
  return res.status(HttpStatus.CONFLICT).json({ code: 'E_DISABLED' })
}
