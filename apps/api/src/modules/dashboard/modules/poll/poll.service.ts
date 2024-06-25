import { Modules } from '@pynspel/common'
import { ModuleBase } from '../base'

class _PoolModuleService extends ModuleBase<typeof Modules.poll> {
  constructor() {
    super(Modules.poll)
  }
}

export const pollModuleService = new _PoolModuleService()
