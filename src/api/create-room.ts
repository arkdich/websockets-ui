import { setupRoom } from '../lib/setup-room.ts'
import { ConnectedClients } from '../db/connected-clients.ts'
import { updateRoom } from '../lib/update-room.ts'
import { MessageParams, Message } from '../lib/Request_d.ts'
import { getWsClients } from '../index.ts'
import { sendResponse } from '../lib/utils.ts'

export const createRoom = ({ ws }: MessageParams) => {
  const clients = new ConnectedClients()
  const user = clients.get(ws)

  if (!user) {
    throw new Error('User not found')
  }

  setupRoom(ws)
  const availableRooms = updateRoom(ws)

  const updateRoomResponse: Message<string> = {
    type: 'update_room',
    data: JSON.stringify(availableRooms),
    id: 0,
  }

  for (const client of getWsClients()) {
    sendResponse(client, updateRoomResponse)
  }
}
