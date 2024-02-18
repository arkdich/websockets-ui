import { Room } from './room-db_d'
import { User } from './user-db_d'

export class RoomDb {
  private static rooms: Room[] = []

  create() {
    const id = RoomDb.rooms.length + 1
    const room: Room = { id, users: [] }

    RoomDb.rooms.push(room)

    return room
  }

  addUser(roomId: number, users: User) {
    const room = RoomDb.rooms.find((room) => room.id === roomId)

    if (!room) {
      throw new Error(`Room with id ${roomId} not found`)
    }

    room.users.push(users)

    return room
  }

  getAll() {
    return RoomDb.rooms
  }
}
