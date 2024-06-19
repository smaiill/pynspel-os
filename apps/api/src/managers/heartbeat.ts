import { Request, Response } from 'express'
import { env } from 'utils/env'
import { lg } from '../utils/logger'

let lastHeartbeatReceived = Date.now()
export let IS_CLIENT_AVAILABLE = true

const TIME_CONCIDER_CLIENT_UNAVAILABLE = 5000

setInterval(async () => {
  // TODO: Instead of invalidating all the cache, just set a setTimeout and
  // TODO: create a variable called isCacheValid to know if it should pick from the cache
  // TODO: After the timeout the cache will be valid again.
  const currentTime = Date.now()
  const timeSinceLastHeartbeat = currentTime - lastHeartbeatReceived

  if (timeSinceLastHeartbeat > TIME_CONCIDER_CLIENT_UNAVAILABLE) {
    lg.warn('No heartbeat received, API may be unavailable')
    IS_CLIENT_AVAILABLE = false
  } else {
    IS_CLIENT_AVAILABLE = true
  }
}, 1000)

export const handleHeartbeat = (req: Request, res: Response) => {
  if (env.CLIENT_TOKEN !== req.headers.authorization) {
    return res.status(200).send()
  }

  lastHeartbeatReceived = Date.now()

  return res.status(200).send()
}
