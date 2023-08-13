import { Request, Response, Router } from 'express'
import { db } from 'modules/db'

export const clientRoutes = Router()

clientRoutes.get('/serving-guilds', async (req: Request, res: Response) => {
  // TODO: Store in the cache. with ex: COUNT_CACHE_KEY_TTL
  const query = 'SELECT COUNT(*) FROM guilds WHERE bot = $1'

  const [_res] = await db.exec<{ count: number }>(query, [true])

  res.json({ count: _res.count })
})
