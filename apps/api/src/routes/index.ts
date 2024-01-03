import { Request, Response, Router } from 'express'
import { disabled } from 'middlewares/disabled'
import { rateLimiter } from 'middlewares/rate.limiter'
import authRoutes from 'modules/auth/auth.routes'
import { clientRoutes } from 'modules/client/client.routes'
import { dashboardRoutes } from 'modules/dashboard/dashboard.routes'
import { db } from 'modules/db'
import { subscriptionRoutes } from 'modules/subscription/stripe.router'
import { userRoutes } from 'modules/user/user.routes'
import { redis } from 'utils/redis'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', rateLimiter, userRoutes.router)
router.use('/dashboard', rateLimiter, dashboardRoutes.router)
router.use('/client', clientRoutes)
router.use('/subscriptions', disabled, rateLimiter, subscriptionRoutes)
router.get('/modules', async (_: Request, res: Response) => {
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
