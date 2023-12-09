import { ModuleRouter } from '../base.router'
import { CaptchaModuleController } from './captcha.controller'

const { router } = new ModuleRouter({
  get: CaptchaModuleController.get.bind(CaptchaModuleController),
  put: CaptchaModuleController.update.bind(CaptchaModuleController),
})

export { router as captchaModuleRouter }
