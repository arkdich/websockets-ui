import { ConnectedClients } from '../db/connected-clients.ts'
import { AddShips, MessageParams, Message } from '../lib/Request_d.ts'
import { RoomDb } from '../db/room-db.ts'
import { GameDb } from '../db/game-db.ts'
import { sendResponse } from '../lib/utils.ts'

export const addShips = ({ data }: MessageParams) => {
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

    const createGameResponse: Message<string> = {
      type: 'create_game',
      data: JSON.stringify({
        idGame: game.id,
        idPlayer: user.id,
      }),
      id: 0,
    }

    sendResponse(ws, createGameResponse)
  })

  if (game.players.length === 2) {
    game.playerTurn = game.players[0].id

    room.users.forEach((ws) => {
      const user = clients.get(ws)

      if (!user) {
        throw new Error('User not found')
      }

      const player = game.players.find((player) => player.id === user.id)

      if (!player) {
        throw new Error('Player not found')
      }

      const startGameResponse: Message<string> = {
        type: 'start_game',
        data: JSON.stringify({
          ships: player.ships,
          currentPlayerIndex: player.id,
        }),
        id: 0,
      }

      const turnResponse: Message<string> = {
        type: 'turn',
        data: JSON.stringify({
          currentPlayer: game.playerTurn,
        }),
        id: 0,
      }

      sendResponse(ws, startGameResponse)
      sendResponse(ws, turnResponse)
    })
  }
}
