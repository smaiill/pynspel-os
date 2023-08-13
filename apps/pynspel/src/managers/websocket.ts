import { WebSocketOperations } from '@pynspel/types'
import { env } from 'utils/env'
import { logger } from 'utils/logger'
import { WebSocket } from 'ws'

const HEARTBEAT_INTERVAL = 1000
const RETRY_CONNECTION_INTERVAL = 2500

let interval: NodeJS.Timer | null = null

const startWs = () => {
  const ws = new WebSocket('ws://localhost:4053', {
    headers: {
      Authorization: `Bot ${env.CLIENT_TOKEN}`,
    },
  })

  ws.on('open', () => {
    logger.info('WebSocket connected')
  })

  ws.on('error', (err) => {
    logger.error(`Error in the websocket ${err?.message}`)
  })

  ws.on('close', (code: number, reason: Buffer) => {
    clearInterval(interval ?? undefined)
    logger.info('Websocket connection closed.')
    logger.info({ code, reason: reason.toString() })
    setTimeout(() => {
      startWs()
    }, RETRY_CONNECTION_INTERVAL)
  })

  const sendHeartbeat = () => {
    ws.send(
      JSON.stringify({
        o: WebSocketOperations.Heartbeat,
      })
    )
  }

  const createdInterval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL)

  interval = createdInterval
}

startWs()
