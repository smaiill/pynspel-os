import { isAValidModule } from '@pynspel/common'
import { Errors, HttpStatus } from '@pynspel/types'
import { Request, Response } from 'express'
import { db } from 'modules/db'
import { ProtectedRouter } from 'routes/protected.router'
import { _decrypt } from 'utils/crypto'
import { HttpCantAccesGuildException, HttpException } from 'utils/error'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'
import { botModuleRouter } from './modules/bot/bot.router'
import { captchaModuleRouter } from './modules/captcha/captcha.router'
import { commandModuleRouter } from './modules/command/command.router'
import { counterRaidModuleRouter } from './modules/counterRaid/counterRaid.router'
import { loggingModuleRouter } from './modules/logging/logging.router'
import { pollModuleRouter } from './modules/poll/poll.router'
import { pollsRouter } from './modules/poll/polls/polls.router'
import { PoolsService } from './modules/poll/polls/polls.service'
import { scannerModuleRouter } from './modules/scanner/scanner.router'
import { panelRouter } from './modules/ticket/panel/panel.router'
import { ticketModuleRouter } from './modules/ticket/ticket.router'

const dashboardRoutes = new ProtectedRouter()
const pollsService = new PoolsService()

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

    const isBotInGuild = await db.isClientInGuild(id)

    if (!isBotInGuild) {
      throw new HttpException(HttpStatus.FORBIDDEN, 'Invalid guild.')
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: id,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

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

dashboardRoutes.get(
  '/guilds/:id/polls',
  async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid guild id')
    }

    const isBotInGuild = await db.isClientInGuild(id)

    if (!isBotInGuild) {
      throw new HttpException(HttpStatus.FORBIDDEN, 'Invalid guild.')
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: id as string,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    const polls = await pollsService.fetchByGuild(id)

    return res.json(polls)
  }
)

dashboardRoutes.put(
  '/guilds/:id/modules/:moduleName',
  async (req: Request, res: Response) => {
    const { id, moduleName } = req.params

    const { is_active } = req.body

    if (!id || !moduleName) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid guild id')
    }

    const isModuleValid = isAValidModule(moduleName)

    if (!isModuleValid) {
      throw new HttpException(HttpStatus.BAD_GATEWAY, 'Invalid module')
    }

    const isBotInGuild = await db.isClientInGuild(id)

    if (!isBotInGuild) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_GUILD_ID)
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: id,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    const [hasModule] = await db.exec(
      'SELECT is_active FROM guild_modules WHERE guild_id = $1 AND module_id = (SELECT module_id FROM modules WHERE name = $2)',
      [id, moduleName]
    )

    if (!hasModule) {
      await db.createModuleConfigForGuild(id, moduleName)

      return res.json({ is_active })
    }

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
dashboardRoutes.use('/poll', pollModuleRouter)
dashboardRoutes.use('/polls', pollsRouter)

export { dashboardRoutes }
