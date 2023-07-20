import { ProtectedRouter } from 'routes/protected.router'
import { DashboardController } from './dashboard.controller'
import { botModuleRouter } from './modules/bot/bot.router'
import { captchaModuleRouter } from './modules/captcha/captcha.router'
import { loggingModuleRouter } from './modules/logging/logging.router'

const dashboardRoutes = new ProtectedRouter()

dashboardRoutes.get(
  '/guilds',
  DashboardController.fetchMutualGuilds.bind(DashboardController)
)

dashboardRoutes.get(
  '/guilds/:id',
  DashboardController.fetchGuild.bind(DashboardController)
)

dashboardRoutes.use('/bot', botModuleRouter)
dashboardRoutes.use('/captcha', captchaModuleRouter)
dashboardRoutes.use('/logging', loggingModuleRouter)

export { dashboardRoutes }
