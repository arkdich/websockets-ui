import { UserDb } from '../db/user-db.ts'
import { User } from '../db/user-db_d.ts'

export const handleUser = (data: Pick<User, 'name' | 'password'>) => {
  if (!data.name || !data.password) {
    throw new Error('Name and password are required')
  }

  const userDb = new UserDb()
  const user = userDb.get(data.name)

  if (!user) {
    return userDb.add(data)
  }

  if (user.password !== data.password) {
    throw new Error('Password is incorrect')
  }

  return user
}
