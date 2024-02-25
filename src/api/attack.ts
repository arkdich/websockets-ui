import WebSocket from 'ws'
import { Attack, AttackResponse, WSRequest } from '../lib/Request_d.ts'
import { RoomDb } from '../db/room-db.ts'
import { GameDb } from '../db/game-db.ts'

export const attack = (ws: WebSocket, data: unknown) => {
  const { gameId, indexPlayer, x, y } = (
    typeof data === 'string' ? JSON.parse(data) : data
  ) as Attack

  const gameDb = new GameDb()
  const game = gameDb.get(gameId)

  if (!game) {
    throw new Error(`Game with id ${gameId} not found`)
  }

  if (game.playerTurn !== indexPlayer) {
    throw new Error('Not your turn')
  }

  const roomDb = new RoomDb()
  const room = roomDb.get(game.roomId)

  if (!room) {
    throw new Error(`Room with id ${game.roomId} not found`)
  }

  const opponent = game.players.find((player) => player.id !== indexPlayer)

  if (!opponent) {
    throw new Error('Enemy ships not found')
  }

  let hit = false

  opponent.ships.forEach((ship) => {
    if (ship.direction) {
      if (
        ship.position.x === x &&
        y <= ship.position.y + ship.length &&
        y >= ship.position.y
      ) {
        hit = true
      }
    }
  })

  const attackResponse: WSRequest<string> = {
    type: 'attack',
    data: JSON.stringify({
      currentPlayer: indexPlayer,
      position: { x, y },
      status: hit ? 'shot' : 'miss',
    } as AttackResponse),
    id: 0,
  }

  game.playerTurn = hit ? indexPlayer : opponent.id

  room.users.forEach((ws) => {
    ws.send(JSON.stringify(attackResponse))
    ws.send(
      JSON.stringify({
        type: 'turn',
        data: JSON.stringify({
          currentPlayer: hit ? indexPlayer : opponent.id,
        }),
        id: 0,
      })
    )
  })
}

// x, y start from 0
// direction: false - horizontal, true - vertical
