import { Request, Response, Router } from 'express'
import { db } from 'modules/db'
import { redis } from 'utils/redis'

export const clientRoutes = Router()

clientRoutes.get('/serving-guilds', async (req: Request, res: Response) => {
  const amount = await getServingGuilds()

  res.json({ count: amount })
})

const getServingGuildsFromCache = async () => {
  const res = await redis._client.get('serving-guilds')

  return res ? Number(res) : null
}

const getServingGuilds = async () => {
  const cacheGuildsLength = await getServingGuildsFromCache()

  if (cacheGuildsLength) {
    return cacheGuildsLength
  }

  const query = 'SELECT COUNT(*) FROM guilds WHERE bot = $1'

  const [_res] = await db.exec<{ count: number }>(query, [true])
  const amount = Number(_res.count)

  redis._client.setEx('serving-guilds', 300, String(amount))

  return amount
}
