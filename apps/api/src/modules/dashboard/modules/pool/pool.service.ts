import { Modules } from '@pynspel/common'
import { ModuleBase } from '../base'

class _PoolModuleService extends ModuleBase<typeof Modules.pool> {
  constructor() {
    super(Modules.pool)
  }
}

export const poolModuleService = new _PoolModuleService()
