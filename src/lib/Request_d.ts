import { User } from '../db/user-db_d'

export type WSRequest<Body = unknown> = {
  type: RequestType
  data: Body
  id: 0
}

export type RequestType = 'reg' | 'update_winners' | 'create_room'

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

export type CreateRoom = {}
