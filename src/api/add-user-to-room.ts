import WebSocket from 'ws'
import { ConnectedClients } from '../db/connected-clients.ts'
import { updateRoom } from '../lib/update-room.ts'
import { AddUserToRoom, WSRequest } from '../lib/Request_d.ts'
import { RoomDb } from '../db/room-db.ts'

export const addUserToRoom = (ws: WebSocket, data: unknown) => {
  const { indexRoom } = (
    typeof data === 'string' ? JSON.parse(data) : data
  ) as AddUserToRoom

  const clients = new ConnectedClients()
  const user = clients.get(ws)

  console.log(data)

  if (!user) {
    throw new Error('User not found')
  }

  const room = new RoomDb()
  room.addUser(indexRoom, ws)

  const availableRooms = updateRoom(ws)
  const updateRoomResponse: WSRequest<string> = {
    type: 'update_room',
    data: JSON.stringify(availableRooms),
    id: 0,
  }

  ws.send(JSON.stringify(updateRoomResponse))
}
