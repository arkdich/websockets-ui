import WebSocket from 'ws'
import { RandomAttack } from '../lib/Request_d.ts'
import { getRandomCoordinate } from '../lib/utils.ts'
import { attack } from './attack.ts'

export const randomAttack = (ws: WebSocket, data: unknown) => {
  const { gameId, indexPlayer } = (
    typeof data === 'string' ? JSON.parse(data) : data
  ) as RandomAttack

  const x = getRandomCoordinate()
  const y = getRandomCoordinate()

  attack(ws, JSON.stringify({ gameId, indexPlayer, x, y }))
}
