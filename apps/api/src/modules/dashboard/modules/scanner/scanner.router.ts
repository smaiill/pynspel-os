import { ModuleRouter } from '../base.router'
import { ScannerModuleController } from './scanner.controller'

const { router } = new ModuleRouter({
  get: ScannerModuleController.getConfig.bind(ScannerModuleController),
  put: ScannerModuleController.updateConfig.bind(ScannerModuleController),
})

export { router as scannerModuleRouter }
