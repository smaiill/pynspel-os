import { ModuleRouter } from '../base.router'
import { CounterRaidModuleController } from './counterRaid.controller'

const { router } = new ModuleRouter({
  get: CounterRaidModuleController.get.bind(CounterRaidModuleController),
  put: CounterRaidModuleController.update.bind(CounterRaidModuleController),
})

export { router as counterRaidModuleRouter }
