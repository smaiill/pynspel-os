import { Request, Response, Router } from 'express'
import authRoutes from 'modules/auth/auth.routes'
import { clientRoutes } from 'modules/client/client.routes'
import { dashboardRoutes } from 'modules/dashboard/dashboard.routes'
import { db } from 'modules/db'
import { userRoutes } from 'modules/user/user.routes'
import { redis } from 'utils/redis'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes.router)
router.use('/dashboard', dashboardRoutes.router)
router.use('/client', clientRoutes)
router.get('/modules', async (req: Request, res: Response) => {
  const cachedModules = await redis._client.get('modules')

  if (!cachedModules) {
    const modulesDb = await db.exec('SELECT name, active FROM modules')

    redis._client.setEx('modules', 600000, JSON.stringify(modulesDb))
    return res.json(modulesDb)
  }

  return res.json(JSON.parse(cachedModules))
})

export default router
