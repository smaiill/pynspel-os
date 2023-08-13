import { WebSocketBody, WebSocketOperations } from '@pynspel/types'
import { env } from 'utils/env'
import { lg } from 'utils/logger'
import { redis } from 'utils/redis'
import { Server } from 'ws'

const wss = new Server({ port: 4053 })

let lastHeartbeatReceived = Date.now()
export let IS_CLIENT_AVAILABLE = true
let isCacheCleared = false

const TIME_CONCIDER_CLIENT_UNAVAILABLE = 5000

const extractTokenFromHeader = (header?: string) => {
  if (!header) {
    return null
  }

  const [source, value] = header.split(' ')

  if (source !== 'Bot' || value !== env.CLIENT_TOKEN) {
    return null
  }

  return value
}

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

setInterval(async () => {
  const currentTime = Date.now()
  const timeSinceLastHeartbeat = currentTime - lastHeartbeatReceived

  if (timeSinceLastHeartbeat > TIME_CONCIDER_CLIENT_UNAVAILABLE) {
    lg.warn('No heartbeat received, API may be unavailable')
    IS_CLIENT_AVAILABLE = false
    try {
      if (!isCacheCleared) {
        await redis._client.flushAll()
        isCacheCleared = true
      }
    } catch (error) {
      isCacheCleared = false
    }
  } else {
    IS_CLIENT_AVAILABLE = true
    isCacheCleared = false
  }
}, 1000)
