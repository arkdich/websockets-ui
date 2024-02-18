import WebSocket from 'ws'
import { setupRoom } from '../lib/setup-room.ts'
import { ConnectedClients } from '../db/connected-clients.ts'
import { updateRoom } from '../lib/update-room.ts'
import { WSRequest } from '../lib/Request_d.ts'

export const createRoom = (ws: WebSocket) => {
  const clients = new ConnectedClients()
  const user = clients.get(ws)

  if (!user) {
    throw new Error('User not found')
  }

  setupRoom(user)
  const availableRooms = updateRoom()

  const updateRoomResponse: WSRequest<string> = {
    type: 'update_room',
    data: JSON.stringify(availableRooms),
    id: 0,
  }

  ws.send(JSON.stringify(updateRoomResponse))
}
