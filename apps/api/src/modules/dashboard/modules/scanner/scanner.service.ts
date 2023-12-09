import { Modules } from '@pynspel/common'
import { ModuleBase } from '../base'

class _ScannerModuleService extends ModuleBase<typeof Modules.scanner> {
  constructor() {
    super(Modules.scanner, {
      update: {
        validators: {
          channels: ['words.ignored_channels', 'links.ignored_channels'],
          roles: [],
        },
      },
    })
  }
}

export const ScannerModuleService = new _ScannerModuleService()
