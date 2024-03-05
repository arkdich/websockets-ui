import { Registration, MessageParams, Message } from '../lib/Request_d.ts'
import { ConnectedClients } from '../db/connected-clients.ts'
import { updateWinners } from '../lib/update-winners.ts'
import { handleUser } from '../lib/handle-user.ts'
import { updateRoom } from '../lib/update-room.ts'
import { getWsClients } from '../index.ts'
import { sendResponse } from '../lib/utils.ts'

export const reg = ({ ws, data }: MessageParams) => {
  const { name, password } = (
    typeof data === 'string' ? JSON.parse(data) : data
  ) as Registration

  try {
    const user = handleUser({ name, password })
    const regResponse: Message<string> = {
      type: 'reg',
      data: JSON.stringify({
        name: user.name,
        index: user.id,
        error: false,
        errorText: '',
      }),
      id: 0,
    }

    const clients = new ConnectedClients()
    clients.add(ws, user)

    sendResponse(ws, regResponse)
  } catch (err: any) {
    const regResponse: Message<string> = {
      type: 'reg',
      data: JSON.stringify({
        name,
        index: -1,
        error: true,
        errorText: err.message,
      }),
      id: 0,
    }

    sendResponse(ws, regResponse)
  }

  const winnersScore = updateWinners()
  const updateWinnersResponse: Message<string> = {
    type: 'update_winners',
    data: JSON.stringify(winnersScore),
    id: 0,
  }

  const availableRooms = updateRoom(ws)
  const updateRoomResponse: Message<string> = {
    type: 'update_room',
    data: JSON.stringify(availableRooms),
    id: 0,
  }

  for (const client of getWsClients()) {
    sendResponse(client, updateRoomResponse)
    sendResponse(client, updateWinnersResponse)
  }
}
