import { Request, Response, Router } from 'express'
import { db } from 'modules/db'

export const clientRoutes = Router()

clientRoutes.get('/serving-guilds', async (req: Request, res: Response) => {
  const query = 'SELECT COUNT(*) FROM guilds'

  const [_res] = await db.exec<{ count: number }>(query)

  res.json({ count: _res.count })
})
