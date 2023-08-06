import { ProtectedRouter } from 'routes/protected.router'
import { DashboardController } from './dashboard.controller'
import { botModuleRouter } from './modules/bot/bot.router'
import { captchaModuleRouter } from './modules/captcha/captcha.router'
import { commandModuleRouter } from './modules/command/command.router'
import { counterRaidModuleRouter } from './modules/counterRaid/counterRaid.router'
import { loggingModuleRouter } from './modules/logging/logging.router'
import { scannerModuleRouter } from './modules/scanner/scanner.router'
import { panelRouter } from './modules/ticket/panel/panel.router'
import { ticketModuleRouter } from './modules/ticket/ticket.router'

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
dashboardRoutes.use('/ticket', ticketModuleRouter)
dashboardRoutes.use('/command', commandModuleRouter)
dashboardRoutes.use('/counter-raid', counterRaidModuleRouter)
dashboardRoutes.use('/scanner', scannerModuleRouter)
dashboardRoutes.use('/panels', panelRouter)

export { dashboardRoutes }
