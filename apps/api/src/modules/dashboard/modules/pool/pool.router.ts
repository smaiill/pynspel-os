import { ModuleRouter } from '../base.router'
import { poolModuleController } from './pool.controller'

const { router } = new ModuleRouter({
  get: poolModuleController.get.bind(poolModuleController),
  put: poolModuleController.update.bind(poolModuleController),
})

export { router as poolModuleRouter }
