import { Modules } from '@pynspel/common'
import { ModuleBase } from '../base'

class _TicketModuleService extends ModuleBase<typeof Modules.ticket> {
  constructor() {
    super(Modules.ticket)
  }
}

export const TicketModuleService = new _TicketModuleService()
