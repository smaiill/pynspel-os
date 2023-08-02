import { ModuleRouter } from '../base.router'
import { CounterRaidModuleController } from './counterRaid.controller'

const { router } = new ModuleRouter({
  get: CounterRaidModuleController.getConfig.bind(CounterRaidModuleController),
  put: CounterRaidModuleController.updateConfig.bind(
    CounterRaidModuleController
  ),
})

export { router as counterRaidModuleRouter }
