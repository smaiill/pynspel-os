import { ModuleRouter } from '../base.router'
import { ScannerModuleController } from './scanner.controller'

const { router } = new ModuleRouter({
  get: ScannerModuleController.get.bind(ScannerModuleController),
  put: ScannerModuleController.update.bind(ScannerModuleController),
})

export { router as scannerModuleRouter }
