import WebSocket from 'ws'
import { User } from '../db/user-db_d'

export type Route = {
  type: RequestType
  handler: (ws: WebSocket, data?: unknown) => void
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
