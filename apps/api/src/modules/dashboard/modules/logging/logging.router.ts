import { ModuleRouter } from '../base.router'
import { LoggingModuleController } from './logging.controller'

const { router } = new ModuleRouter({
  get: LoggingModuleController.getConfig.bind(LoggingModuleController),
  put: LoggingModuleController.updateConfig.bind(LoggingModuleController),
})

export { router as loggingModuleRouter }
