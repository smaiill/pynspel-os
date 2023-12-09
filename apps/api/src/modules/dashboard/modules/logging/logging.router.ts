import { ModuleRouter } from '../base.router'
import { LoggingModuleController } from './logging.controller'

const { router } = new ModuleRouter({
  get: LoggingModuleController.get.bind(LoggingModuleController),
  put: LoggingModuleController.update.bind(LoggingModuleController),
})

export { router as loggingModuleRouter }
