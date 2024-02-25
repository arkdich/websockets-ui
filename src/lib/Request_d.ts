import WebSocket from 'ws'
import { User } from '../db/user-db_d'

export type Route = {
  type: RequestType
  handler: (params: RequestParams) => void
}

export type RequestParams = {
  ws: WebSocket
  data?: unknown
}

export type WSRequest<Body = unknown> = {
  type: RequestType
  data: Body
  id: 0
}

export type RequestType =
  | 'reg'
  | 'update_winners'
  | 'create_room'
  | 'update_room'
  | 'add_user_to_room'
  | 'create_game'
  | 'add_ships'
  | 'start_game'
  | 'turn'
  | 'attack'
  | 'randomAttack'
  | 'finish'

export type Registration = {
  name: string
  password: string
}

export type RegistrationResponse = {
  name: string
  index: number
  error: boolean
  errorText: string
}

export type UpdateWinners = {
  name: User['name']
  wins: number
}

export type AddUserToRoom = {
  indexRoom: number
}

export type UpdateRoom = {
  roomId: number
  roomUsers: {
    name: string
    index: number
  }[]
}

export type CreateGame = {
  idGame: number | string
  idPlayer: number | string
}

export type AddShips = {
  gameId: number | string
  ships: Ship[]
  indexPlayer: number | string
}

export type Ship = {
  position: {
    x: number
    y: number
  }
  direction: boolean // false - horizontal, true - vertical
  length: number
  type: 'small' | 'medium' | 'large' | 'huge'
}

export type Turn = {
  currentPlayer: number | string
}

export type Attack = {
  gameId: number | string
  x: number
  y: number
  indexPlayer: number | string
}

export type AttackResponse = {
  position: {
    x: number
    y: number
  }
  currentPlayer: number | string
  status: 'miss' | 'killed' | 'shot'
}

export type RandomAttack = {
  gameId: number | string
  indexPlayer: number | string
}

export type Finish = {
  winPlayer: number | string
}
