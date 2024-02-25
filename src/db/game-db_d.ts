import { Ship } from '../lib/Request_d'

export type Game = {
  id: string | number
  roomId: number
  players: { id: string | number; ships: Ship[] }[]
}
