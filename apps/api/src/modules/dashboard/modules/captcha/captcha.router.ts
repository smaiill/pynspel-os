import { ModuleRouter } from '../base.router'
import { CaptchaModuleController } from './captcha.controller'

const { router } = new ModuleRouter({
  get: CaptchaModuleController.getConfig.bind(CaptchaModuleController),
  put: CaptchaModuleController.updateConfig.bind(CaptchaModuleController),
})

export { router as captchaModuleRouter }
