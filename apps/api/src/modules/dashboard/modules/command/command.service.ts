import { Modules } from '@pynspel/common'
import { ModuleBase } from '../base'

class _CommandModuleService extends ModuleBase<typeof Modules.command> {
  constructor() {
    super(Modules.command)
  }
}

export const CommandModuleService = new _CommandModuleService()
