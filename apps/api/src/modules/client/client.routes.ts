import { Request, Response, Router } from 'express'
import { db } from 'modules/db'

export const clientRoutes = Router()
const COUNT_CACHE_KEY_TTL = 60 * 5 // 5 minutes.

clientRoutes.get('/serving-guilds', async (req: Request, res: Response) => {
  // TODO: Store in the cache. with ex: COUNT_CACHE_KEY_TTL
  const query = 'SELECT COUNT(*) FROM guilds'

  const [_res] = await db.exec<{ count: number }>(query)

  res.json({ count: _res.count })
})
