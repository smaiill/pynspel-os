export enum WebSocketOperations {
  Heartbeat = 1,
}

export type HeartbeatBody = {
  o: WebSocketOperations.Heartbeat
  d: {
    token: string
  }
}

export type WebSocketBody = HeartbeatBody
