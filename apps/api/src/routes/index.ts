import { Router } from 'express'
import authRoutes from 'modules/auth/auth.routes'
import { clientRoutes } from 'modules/client/client.routes'
import { dashboardRoutes } from 'modules/dashboard/dashboard.routes'
import { userRoutes } from 'modules/user/user.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes.router)
router.use('/dashboard', dashboardRoutes.router)
router.use('/client', clientRoutes)

export default router
