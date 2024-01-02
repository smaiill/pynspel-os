import { WebSocketOperations } from '@pynspel/types'
import { env } from 'utils/env'
import { logger } from 'utils/logger'
import { WebSocket } from 'ws'

const HEARTBEAT_INTERVAL = 1000
const RETRY_CONNECTION_INTERVAL = 2500

enum WebSocketEvent {
  Open = 'open',
  Error = 'error',
  Close = 'close',
}

let interval: NodeJS.Timer | null = null

const handleWebSocketOpen = () => {
  logger.info('WebSocket connected')
}

const handleWebSocketError = (error: Error) => {
  logger.error(`WebSocket error: ${error.message}`)
}

const handleWebSocketClose = (code: number, reason: Buffer) => {
  clearInterval(interval ?? undefined)
  logger.info('WebSocket connection closed.')
  logger.info({ code, reason: reason.toString() })
  setTimeout(startWs, RETRY_CONNECTION_INTERVAL)
}

const sendHeartbeat = (ws: WebSocket) => {
  if (ws.readyState !== WebSocket.OPEN) {
    return
  }
  try {
    ws.send(
      JSON.stringify({
        o: WebSocketOperations.Heartbeat,
      })
    )
  } catch (error) {
    logger.error(
      `Error sending heartbeat: ${(error as { message: string })?.message}`
    )
  }
}

export const startWs = () => {
  const ws = new WebSocket(env.WS, {
    headers: {
      Authorization: `Bot ${env.CLIENT_TOKEN}`,
    },
  })

  ws.on(WebSocketEvent.Open, handleWebSocketOpen)
  ws.on(WebSocketEvent.Error, handleWebSocketError)
  ws.on(WebSocketEvent.Close, handleWebSocketClose)

  const createdInterval = setInterval(
    () => sendHeartbeat(ws),
    HEARTBEAT_INTERVAL
  )
  interval = createdInterval
}
