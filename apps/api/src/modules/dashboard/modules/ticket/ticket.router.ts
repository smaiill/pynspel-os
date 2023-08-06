import { ModuleRouter } from '../base.router'
import { ticketModuleController } from './ticket.controller'

const { router } = new ModuleRouter({
  get: ticketModuleController.getConfig.bind(ticketModuleController),
  put: ticketModuleController.updateConfig.bind(ticketModuleController),
})

export { router as ticketModuleRouter }
