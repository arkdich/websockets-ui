import { RoomDb } from '../db/room-db.ts'
import { UpdateRoom } from './Request_d.ts'

export const updateRoom = () => {
  const roomDb = new RoomDb()
  const rooms = roomDb.getAll()

  const availableRooms = rooms.filter((room) => room.users.length < 2)

  const roomsData: UpdateRoom[] = availableRooms.map((room) => ({
    roomId: room.id,
    roomUsers: room.users.map((user) => ({ name: user.name, index: user.id })),
  }))

  return roomsData
}
