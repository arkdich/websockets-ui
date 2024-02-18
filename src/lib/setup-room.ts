import { RoomDb } from '../db/room-db.ts'
import { User } from '../db/user-db_d'

export const setupRoom = (user: User) => {
  const roomDb = new RoomDb()

  const room = roomDb.create()
  roomDb.addUser(room.id, user)

  return room
}
