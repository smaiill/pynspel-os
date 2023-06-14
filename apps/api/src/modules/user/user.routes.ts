import { UserController } from 'modules/user/user.controller'
import { ProtectedRouter } from 'routes/protected.router'

const userRoutes = new ProtectedRouter()

userRoutes.get('/@me', UserController.getDiscordUser.bind(UserController))

export { userRoutes }
