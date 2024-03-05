import WebSocket from 'ws'
import { RoomDb } from '../db/room-db.ts'
import { UpdateRoom } from './Request_d.ts'
import { ConnectedClients } from '../db/connected-clients.ts'

export const updateRoom = (ws: WebSocket) => {
  const roomDb = new RoomDb()
  const clients = new ConnectedClients()

  const rooms = roomDb.getAll()

  const availableRooms = rooms.filter((room) => room.users.length < 2)

  const roomsData: UpdateRoom[] = availableRooms.map((room) => {
    const user = clients.get(ws)

    if (!user) {
      throw new Error('User not found')
    }

    return {
      roomId: room.id,
      roomUsers: room.users.map((ws) => {
        const user = clients.get(ws)

        if (!user) {
          throw new Error('User not found')
        }

        return { name: user.name, index: user.id }
      }),
    }
  })

  return roomsData
}
