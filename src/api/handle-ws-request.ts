import WebSocket from 'ws'
import { MessageType } from '../lib/Request_d'
import { routes } from './routes.ts'

export const handleMessage = (
  ws: WebSocket,
  type: MessageType,
  data: unknown
) => {
  const requestHandler = routes[type]

  if (!requestHandler) {
    throw new Error(`${type} is invalid client message type`)
  }

  requestHandler.handler({ ws, data })
}
