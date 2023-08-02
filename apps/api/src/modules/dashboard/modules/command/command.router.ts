import { ModuleRouter } from '../base.router'
import { CommandModuleController } from './command.controller'

const { router } = new ModuleRouter({
  get: CommandModuleController.getConfig.bind(CommandModuleController),
  put: CommandModuleController.updateConfig.bind(CommandModuleController),
})

export { router as commandModuleRouter }
