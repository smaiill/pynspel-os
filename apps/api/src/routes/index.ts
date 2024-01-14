import { Request, Response, Router } from 'express'
import { rateLimiter } from 'middlewares/rate.limiter'
import authRoutes from 'modules/auth/auth.routes'
import { clientRoutes } from 'modules/client/client.routes'
import { dashboardRoutes } from 'modules/dashboard/dashboard.routes'
import { db } from 'modules/db'
import { subscriptionRoutes } from 'modules/subscription/stripe.router'
import { userRoutes } from 'modules/user/user.routes'
import { redis } from 'utils/redis'
import { deserializeSession } from 'utils/session'

const router = Router()

router.use('/v1/auth', authRoutes)
router.use('/v1//users', rateLimiter, deserializeSession, userRoutes.router)
router.use(
  '/v1/dashboard',
  rateLimiter,
  deserializeSession,
  dashboardRoutes.router
)
router.use('/v1/client', clientRoutes)
router.use(
  '/v1/subscriptions',
  rateLimiter,
  deserializeSession,
  subscriptionRoutes
)
router.get('/v1/modules', async (_: Request, res: Response) => {
  const cachedModules = await redis._client.get('modules')

  if (!cachedModules) {
    const modulesDb = await db.exec(
      'SELECT name, active, module_id FROM modules'
    )

    redis._client.setEx('modules', 600000, JSON.stringify(modulesDb))
    return res.json(modulesDb)
  }

  return res.json(JSON.parse(cachedModules))
})

export default router
