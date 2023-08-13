import { HttpStatus } from '@pynspel/types'
import { Request, Response } from 'express'
import { db } from 'modules/db'
import { ProtectedRouter } from 'routes/protected.router'
import { HttpException } from 'utils/error'
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

dashboardRoutes.get(
  '/guilds/:id/modules',
  async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid guild id')
    }

    // TODO: Check if the bot and user are in the guild.
    const modules = await db.exec(
      'SELECT name, is_active, guild_modules.module_id AS module_id FROM modules JOIN guild_modules ON modules.module_id = guild_modules.module_id WHERE guild_modules.guild_id = $1',
      [id]
    )

    if (!modules) {
      return []
    }

    res.json(modules)
  }
)

// This is cause i didnt setup for multiple middlewares
dashboardRoutes.put(
  '/guilds/:id/modules/:moduleName',
  async (req: Request, res: Response) => {
    const { id, moduleName } = req.params
    console.log({ id, moduleName })

    const { is_active } = req.body

    if (!id || !moduleName) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid guild id')
    }

    // TODO: Check if the bot and user are in the guild.
    await db.exec(
      'UPDATE guild_modules SET is_active = $1 WHERE guild_id = $2 AND module_id = (SELECT module_id FROM modules WHERE name = $3)',
      [Boolean(is_active), id, moduleName]
    )

    res.json({ is_active })
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
