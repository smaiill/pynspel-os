import { Modules } from '@pynspel/common'
import { ModuleBase } from '../base'

class _CounterRaidModuleService extends ModuleBase<typeof Modules.counterRaid> {
  constructor() {
    super(Modules.counterRaid)
  }
}

export const CounterRaidModuleService = new _CounterRaidModuleService()
