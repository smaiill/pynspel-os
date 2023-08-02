import { Modules } from '@pynspel/common'
import { ModuleBase } from '../base'

class _ScannerModuleService extends ModuleBase<typeof Modules.scanner> {
  constructor() {
    super(Modules.scanner)
  }
}

export const ScannerModuleService = new _ScannerModuleService()
