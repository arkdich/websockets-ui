import WebSocket from 'ws'
import { ConnectedClients } from '../db/connected-clients.ts'
import { updateRoom } from '../lib/update-room.ts'
import { AddUserToRoom, WSRequest } from '../lib/Request_d.ts'
import { RoomDb } from '../db/room-db.ts'
import { GameDb } from '../db/game-db.ts'
import { getWsClients } from '../index.ts'

export const addUserToRoom = (ws: WebSocket, data: unknown) => {
  const { indexRoom } = (
    typeof data === 'string' ? JSON.parse(data) : data
  ) as AddUserToRoom

  const clients = new ConnectedClients()

  const roomDb = new RoomDb()
  const room = roomDb.get(indexRoom)

  if (!room) {
    throw new Error(`Room with id ${indexRoom} not found`)
  }

  roomDb.addUser(indexRoom, ws)

  const gameDb = new GameDb()
  const game = gameDb.create(indexRoom)

  const availableRooms = updateRoom(ws)
  const updateRoomResponse: WSRequest<string> = {
    type: 'update_room',
    data: JSON.stringify(availableRooms),
    id: 0,
  }

  for (const client of getWsClients()) {
    client.send(JSON.stringify(updateRoomResponse))
  }

  room.users.forEach((ws) => {
    const user = clients.get(ws)

    if (!user) {
      throw new Error('User not found')
    }

    const createGameResponse: WSRequest<string> = {
      type: 'create_game',
      data: JSON.stringify({
        idGame: game.id,
        idPlayer: user.id,
      }),
      id: 0,
    }

    ws.send(JSON.stringify(createGameResponse))
  })
}
