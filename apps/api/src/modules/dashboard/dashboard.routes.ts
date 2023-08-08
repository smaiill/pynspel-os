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
import { Request, Response } from 'express'
import { HttpException } from 'utils/error'
import { HttpStatus } from '@pynspel/types'
import { db } from 'modules/db'

const dashboardRoutes = new ProtectedRouter()

dashboardRoutes.get(
  '/guilds',
  DashboardController.fetchMutualGuilds.bind(DashboardController)
)

dashboardRoutes.get(
  '/guilds/:id',
  DashboardController.fetchGuild.bind(DashboardController)
)

dashboardRoutes.get(
  '/guilds/:id/modules',
  async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid guild id')
    }

    // TODO: Check if the bot and user are in the guild.
    const modules = await db.exec(
      'SELECT name, is_active FROM modules JOIN guild_modules ON modules.module_id = guild_modules.module_id WHERE guild_modules.guild_id = $1',
      [id]
    )

    if (!modules) {
      return []
    }

    res.json(modules)
  }
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
