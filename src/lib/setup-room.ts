import WebSocket from 'ws'
import { RoomDb } from '../db/room-db.ts'

export const setupRoom = (ws: WebSocket) => {
  const roomDb = new RoomDb()

  const room = roomDb.create()
  roomDb.addUser(room.id, ws)

  return room
}
