import { Modules } from '@pynspel/common'
import { ModuleBase } from '../base'

class _LoggingModuleService extends ModuleBase<typeof Modules.logging> {
  constructor() {
    super(Modules.logging, {
      update: {
        validators: {
          channels: ['channel'],
          roles: [],
        },
      },
    })
  }
}

export const LoggingModuleService = new _LoggingModuleService()
