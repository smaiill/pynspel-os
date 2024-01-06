import { WebSocketBody, WebSocketOperations } from '@pynspel/types'
import { Server } from 'ws'
import { env } from '../utils/env'
import { lg } from '../utils/logger'

let lastHeartbeatReceived = Date.now()
export let IS_CLIENT_AVAILABLE = true

const TIME_CONCIDER_CLIENT_UNAVAILABLE = 5000

const extractTokenFromHeader = (header?: string) => {
  if (!header) {
    return false
  }

  const [source, value] = header.split(' ')

  if (source !== 'Bot' || value !== env.CLIENT_TOKEN) {
    return false
  }

  return true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const websockets = (server: any) => {
  const wss = new Server({ server, path: '/ws' })

  wss.on('connection', (ws, req) => {
    lg.info('WebSocket connected')

    const isAuthorized = extractTokenFromHeader(req.headers.authorization)

    if (!isAuthorized) {
      ws.close(1000, 'Unauthorized')
    }

    lastHeartbeatReceived = Date.now()

    ws.on('message', (message: string) => {
      const data = JSON.parse(message) as WebSocketBody

      switch (data.o) {
        case WebSocketOperations.Heartbeat:
          lastHeartbeatReceived = Date.now()
          break

        default:
          break
      }
    })

    ws.on('close', () => {
      lg.info('Websocket connection closed.')
    })
  })
}

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
