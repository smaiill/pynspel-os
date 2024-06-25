import { ModuleRouter } from '../base.router'
import { pollModuleController } from './poll.controller'

const { router } = new ModuleRouter({
  get: pollModuleController.get.bind(pollModuleController),
  put: pollModuleController.update.bind(pollModuleController),
})

export { router as pollModuleRouter }
