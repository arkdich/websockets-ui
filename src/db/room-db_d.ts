import WebSocket from 'ws'

export type Room = {
  id: number
  users: WebSocket[]
}
