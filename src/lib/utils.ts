import WebSocket from 'ws'
import { PlayerShip } from '../db/game-db_d'
import { Ship, Message } from './Request_d'

export const getRandomCoordinate = () => {
  return Math.floor(Math.random() * 10)
}

export const isCoordinateMatches = (ship: Ship, x: number, y: number) => {
  const isVertical = ship.direction
  const isMatchesVertical =
    isVertical &&
    ship.position.x === x &&
    y < ship.position.y + ship.length &&
    y >= ship.position.y

  const isMatchesHorizontal =
    !isVertical &&
    ship.position.y === y &&
    x < ship.position.x + ship.length &&
    x >= ship.position.x

  return isMatchesHorizontal || isMatchesVertical
}

export const getClosestCells = (ship: PlayerShip) => {
  const isVertical = ship.direction
  const cells: { x: number; y: number }[] = []

  for (let i = -1; i <= ship.length; i++) {
    if (i === -1 || i === ship.length) {
      cells.push(
        isVertical
          ? { y: ship.position.y + i, x: ship.position.x }
          : { x: ship.position.x + i, y: ship.position.y }
      )
    }

    cells.push(
      ...(isVertical
        ? [
            { y: ship.position.y + i, x: ship.position.x - 1 },
            { y: ship.position.y + i, x: ship.position.x + 1 },
          ]
        : [
            { x: ship.position.x + i, y: ship.position.y - 1 },
            { x: ship.position.x + i, y: ship.position.y + 1 },
          ])
    )
  }

  return cells
}

export const sendResponse = (ws: WebSocket, response: Message<string>) => {
  console.log('Server response:\n', response)
  ws.send(JSON.stringify(response))
}
