import { Modules } from '@pynspel/common'
import { ModuleBase } from '../base'

class _CaptchaModuleService extends ModuleBase<typeof Modules.captcha> {
  constructor() {
    super(Modules.captcha)
  }
}

export const CaptchaModuleService = new _CaptchaModuleService()
