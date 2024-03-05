import { Ship } from '../lib/Request_d'

export type Game = {
  id: string | number
  roomId: number
  playerTurn: string | number | null
  players: { id: string | number; ships: PlayerShip[] }[]
}

export type PlayerShip = Ship & { health: number }
