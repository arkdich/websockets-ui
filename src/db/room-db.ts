import WebSocket from 'ws'
import { Room } from './room-db_d'

export class RoomDb {
  private static rooms: Room[] = []

  create() {
    const id = RoomDb.rooms.length + 1
    const room: Room = { id, users: [] }

    RoomDb.rooms.push(room)

    return room
  }

  addUser(roomId: number, ws: WebSocket) {
    const room = RoomDb.rooms.find((room) => room.id === roomId)

    if (!room) {
      throw new Error(`Room with id ${roomId} not found`)
    }

    room.users.push(ws)

    return room
  }

  get(id: number) {
    return RoomDb.rooms.find((room) => room.id === id) ?? null
  }

  getAll() {
    return RoomDb.rooms
  }
}
