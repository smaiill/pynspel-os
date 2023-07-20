import { Modules } from '@pynspel/common'
import { ModuleBase } from '../base'

class _BotModuleService extends ModuleBase<typeof Modules.bot> {
  constructor() {
    super(Modules.bot)
  }
}

export const BotModuleService = new _BotModuleService()
