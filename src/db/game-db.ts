import { Ship } from '../lib/Request_d'
import { Game } from './game-db_d'

export class GameDb {
  private static games: Game[] = []

  create(roomId: number) {
    const id = GameDb.games.length + 1
    const game: Game = { id, roomId, players: [] }

    GameDb.games.push(game)

    return game
  }

  addPlayer(gameId: string | number, playerId: string | number, ships: Ship[]) {
    const game = GameDb.games.find((game) => game.id === gameId)

    if (!game) {
      throw new Error(`Game with id ${gameId} not found`)
    }

    const player = { id: playerId, ships: ships }
    game.players.push(player)

    return player
  }

  get(id: string | number) {
    return GameDb.games.find((game) => game.id === id) ?? null
  }
}
