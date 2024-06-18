import { Router } from 'express'
import { AuthController } from 'modules/auth/auth.controller'
import { deserializeSession } from 'utils/session'

const router = Router()

router.get('/callback', AuthController.redirect.bind(AuthController))
router.get(
  '/status',
  AuthController.getAuthenticatedUserController.bind(AuthController)
)
router.get(
  '/revoke',
  deserializeSession,
  AuthController.revoke.bind(AuthController)
)

export default router
