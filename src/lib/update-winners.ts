import { UserDb } from '../db/user-db.ts'

export const updateWinners = () => {
  const userDb = new UserDb()
  const users = userDb.getAll()

  const winnersScore = users.map((user) => ({
    name: user.name,
    wins: user.wins,
  }))

  return winnersScore
}
