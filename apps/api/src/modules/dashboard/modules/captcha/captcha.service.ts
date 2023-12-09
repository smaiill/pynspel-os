import { Modules } from '@pynspel/common'
import { ModuleBase } from '../base'

class _CaptchaModuleService extends ModuleBase<typeof Modules.captcha> {
  constructor() {
    super(Modules.captcha, {
      update: {
        validators: {
          channels: ['verification_channel'],
          roles: ['role_id'],
        },
      },
    })
  }
}

export const CaptchaModuleService = new _CaptchaModuleService()
