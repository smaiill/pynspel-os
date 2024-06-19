import { ERoutes } from '@pynspel/types'
import { env } from 'utils/env'
import { logger } from 'utils/logger'

const sendHeartbeat = async () => {
  try {
    await fetch(`${env.API}${ERoutes.Heartbeat}`, {
      headers: {
        Authorization: env.CLIENT_TOKEN,
      },
    })
  } catch (error) {
    logger.error(error)
  }
}

export const startHeartbeat = () => {
  setInterval(sendHeartbeat, 1500)
}
