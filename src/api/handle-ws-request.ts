import WebSocket from 'ws'
import { RequestType } from '../lib/Request_d'
import { routes } from './routes.ts'

export const handleWsRequest = (
  ws: WebSocket,
  type: RequestType,
  data: unknown
) => {
  const requestHandler = routes[type]

  if (!requestHandler) {
    throw new Error(`${type} is invalid client message type`)
  }

  requestHandler.handler(ws, data)
}
