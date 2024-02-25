import WebSocket from 'ws'
import { Attack, AttackResponse, Finish, WSRequest } from '../lib/Request_d.ts'
import { RoomDb } from '../db/room-db.ts'
import { GameDb } from '../db/game-db.ts'
import { getClosestCells, isCoordinateMatches } from '../lib/utils.ts'
import { PlayerShip } from '../db/game-db_d.ts'
import { updateWinners } from '../lib/update-winners.ts'
import { getWsClients } from '../index.ts'
import { UserDb } from '../db/user-db.ts'

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

  let shootStatus: AttackResponse['status'] = 'miss'
  let destroyedShip: PlayerShip | null = null

  opponent.ships.forEach((ship) => {
    const isMatches = isCoordinateMatches(ship, x, y)

    if (isMatches) {
      shootStatus = 'shot'
      ship.health -= 1

      if (ship.health === 0) {
        shootStatus = 'killed'
        destroyedShip = ship
      }
    }
  })

  const allShipsDestroyed = opponent.ships.every((ship) => ship.health === 0)
  game.playerTurn = shootStatus !== 'miss' ? indexPlayer : opponent.id

  room.users.forEach((ws) => {
    const attackResponse: WSRequest<string> = {
      type: 'attack',
      data: JSON.stringify({
        currentPlayer: indexPlayer,
        position: { x, y },
        status: shootStatus,
      } as AttackResponse),
      id: 0,
    }

    ws.send(JSON.stringify(attackResponse))

    if (shootStatus === 'killed' && destroyedShip) {
      const cells = getClosestCells(destroyedShip)

      cells.forEach((cell) => {
        const destroyedShipResponse: WSRequest<string> = {
          type: 'attack',
          data: JSON.stringify({
            currentPlayer: indexPlayer,
            position: { x: cell.x, y: cell.y },
            status: 'miss',
          } as AttackResponse),
          id: 0,
        }

        ws.send(JSON.stringify(destroyedShipResponse))
      })
    }

    if (allShipsDestroyed) {
      ws.send(
        JSON.stringify({
          type: 'finish',
          data: JSON.stringify({
            winPlayer: indexPlayer,
          } as Finish),
          id: 0,
        })
      )
    } else {
      ws.send(
        JSON.stringify({
          type: 'turn',
          data: JSON.stringify({
            currentPlayer: game.playerTurn,
          }),
          id: 0,
        })
      )
    }

    if (allShipsDestroyed) {
      const userDb = new UserDb()
      userDb.incrementWins(indexPlayer)

      const winnersScore = updateWinners()
      const updateWinnersResponse: WSRequest<string> = {
        type: 'update_winners',
        data: JSON.stringify(winnersScore),
        id: 0,
      }

      for (const client of getWsClients()) {
        client.send(JSON.stringify(updateWinnersResponse))
      }
    }
  })
}
