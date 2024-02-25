import { RandomAttack, MessageParams } from '../lib/Request_d.ts'
import { getRandomCoordinate } from '../lib/utils.ts'
import { attack } from './attack.ts'

export const randomAttack = ({ ws, data }: MessageParams) => {
  const { gameId, indexPlayer } = (
    typeof data === 'string' ? JSON.parse(data) : data
  ) as RandomAttack

  const x = getRandomCoordinate()
  const y = getRandomCoordinate()

  attack({ ws, data: JSON.stringify({ gameId, indexPlayer, x, y }) })
}
