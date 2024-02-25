import WebSocket from 'ws'
import { ConnectedClients } from '../db/connected-clients.ts'
import { AddShips, WSRequest } from '../lib/Request_d.ts'
import { RoomDb } from '../db/room-db.ts'
import { GameDb } from '../db/game-db.ts'

export const addShips = (ws: WebSocket, data: unknown) => {
  const { gameId, ships, indexPlayer } = (
    typeof data === 'string' ? JSON.parse(data) : data
  ) as AddShips

  const gameDb = new GameDb()
  const game = gameDb.get(gameId)

  if (!game) {
    throw new Error(`Game with id ${gameId} not found`)
  }

  const roomDb = new RoomDb()
  const room = roomDb.get(game.roomId)

  if (!room) {
    throw new Error(`Room with id ${game.roomId} not found`)
  }

  gameDb.addPlayer(gameId, indexPlayer, ships)

  const clients = new ConnectedClients()

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

  if (game.players.length === 2) {
    room.users.forEach((ws) => {
      const user = clients.get(ws)

      if (!user) {
        throw new Error('User not found')
      }

      const player = game.players.find((player) => player.id === user.id)

      if (!player) {
        throw new Error('Player not found')
      }

      const startGameResponse: WSRequest<string> = {
        type: 'start_game',
        data: JSON.stringify({
          ships: player.ships,
          currentPlayerIndex: player.id,
        }),
        id: 0,
      }

      ws.send(JSON.stringify(startGameResponse))
    })
  }
}
