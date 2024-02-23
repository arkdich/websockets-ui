import WebSocket from 'ws'
import { Registration, WSRequest } from '../lib/Request_d.ts'
import { ConnectedClients } from '../db/connected-clients.ts'
import { updateWinners } from '../lib/update-winners.ts'
import { handleUser } from '../lib/handle-user.ts'
import { updateRoom } from '../lib/update-room.ts'

export const reg = (ws: WebSocket, data: unknown) => {
  const { name, password } = (
    typeof data === 'string' ? JSON.parse(data) : data
  ) as Registration

  try {
    const user = handleUser({ name, password })
    const regResponse: WSRequest<string> = {
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

    ws.send(JSON.stringify(regResponse))
  } catch (err: any) {
    const regResponse: WSRequest<string> = {
      type: 'reg',
      data: JSON.stringify({
        name,
        index: -1,
        error: true,
        errorText: err.message,
      }),
      id: 0,
    }

    ws.send(JSON.stringify(regResponse))
  }

  const winnersScore = updateWinners()
  const updateWinnersResponse: WSRequest<string> = {
    type: 'update_winners',
    data: JSON.stringify(winnersScore),
    id: 0,
  }

  ws.send(JSON.stringify(updateWinnersResponse))

  const availableRooms = updateRoom(ws)
  const updateRoomResponse: WSRequest<string> = {
    type: 'update_room',
    data: JSON.stringify(availableRooms),
    id: 0,
  }

  ws.send(JSON.stringify(updateRoomResponse))
}
