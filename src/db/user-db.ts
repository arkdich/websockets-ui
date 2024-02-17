import { User } from './user-db_d'

export class UserDb {
  private users: User[] = []

  add(user: User) {
    this.users.push(user)

    return user
  }
}
