import WebSocket from 'ws'
import { RequestType } from '../lib/Request_d'
import { routes } from './routes.ts'

export const handleWsRequest = async (
  ws: WebSocket,
  type: RequestType,
  data: unknown
) => {
  const requestHandler = routes[type]

  if (!requestHandler) {
    throw new Error(`${type} is not a valid request type`)
  }

  requestHandler.handler(ws, data)
}
