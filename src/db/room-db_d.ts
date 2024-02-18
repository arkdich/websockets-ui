import { User } from './user-db_d'

export type Room = {
  id: number
  users: Pick<User, 'id' | 'name'>[]
}
