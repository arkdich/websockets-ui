import WebSocket from 'ws'
import { User } from './user-db_d'

export class ConnectedClients {
  private static clients: WeakMap<WebSocket, User> = new WeakMap()

  add(ws: WebSocket, user: User) {
    ConnectedClients.clients.set(ws, user)
  }

  remove(ws: WebSocket) {
    ConnectedClients.clients.delete(ws)
  }

  get(ws: WebSocket) {
    return ConnectedClients.clients.get(ws)
  }
}
