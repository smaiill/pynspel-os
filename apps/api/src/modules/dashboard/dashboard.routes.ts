import { ProtectedRouter } from 'routes/protected.router'
import { DashboardController } from './dashboard.controller'
import { botModuleRouter } from './modules/bot/bot.router'

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

export { dashboardRoutes }
