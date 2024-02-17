import { User } from './user-db_d'

export class UserDb {
  private static users: User[] = []

  add(data: Omit<User, 'id'>) {
    const isUserExists = UserDb.users.some((user) => user.name === data.name)

    if (isUserExists) {
      throw new Error('User already exists')
    }

    const id = UserDb.users.length + 1

    const user = { id, ...data }
    UserDb.users.push(user)

    return user
  }
}
