import { proxy, useSnapshot } from 'valtio'

export const botModuleProxy = proxy<{ configuration: any }>({
  configuration: null,
})

export const useBotModuleSnapshpt = () => useSnapshot(botModuleProxy)

export const captchaModuleProxy = proxy<{ configuration: any }>({
  configuration: null,
})

export const useCaptchaModuleSnapshpt = () => useSnapshot(captchaModuleProxy)
