import { ModuleRouter } from '../base.router'
import { BotModuleController } from './bot.controller'

const { router } = new ModuleRouter({
  get: BotModuleController.getConfig.bind(BotModuleController),
  put: BotModuleController.updateConfig.bind(BotModuleController),
})

export { router as botModuleRouter }
