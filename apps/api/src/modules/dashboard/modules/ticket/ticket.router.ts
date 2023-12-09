import { ModuleRouter } from '../base.router'
import { ticketModuleController } from './ticket.controller'

const { router } = new ModuleRouter({
  get: ticketModuleController.get.bind(ticketModuleController),
  put: ticketModuleController.update.bind(ticketModuleController),
})

export { router as ticketModuleRouter }
