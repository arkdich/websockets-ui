import { User } from './user-db_d'

export class UserDb {
  private static users: User[] = []

  add(data: Pick<User, 'name' | 'password'>) {
    const isUserExists = UserDb.users.some((user) => user.name === data.name)

    if (isUserExists) {
      throw new Error('User already exists')
    }

    const id = UserDb.users.length + 1

    const user = { id, wins: 0, ...data }
    UserDb.users.push(user)

    return user
  }

  get(name: string) {
    const user = UserDb.users.find((user) => user.name === name)

    return user ?? null
  }

  getAll() {
    return UserDb.users
  }
}
