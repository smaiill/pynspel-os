import { ModuleRouter } from '../base.router'
import { CommandModuleController } from './command.controller'

const { router } = new ModuleRouter({
  get: CommandModuleController.get.bind(CommandModuleController),
  put: CommandModuleController.update.bind(CommandModuleController),
})

export { router as commandModuleRouter }
