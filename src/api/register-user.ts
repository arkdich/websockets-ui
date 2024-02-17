import WebSocket from 'ws'
import { UserDb } from '../db/user-db.ts'
import { Registration, WSRequest } from '../lib/Request_d.ts'

export const registerUser = async (ws: WebSocket, data: unknown) => {
  const { name, password } = (
    typeof data === 'string' ? JSON.parse(data) : data
  ) as Registration

  if (!name || !password) {
    throw new Error('Invalid data')
  }

  const userDb = new UserDb()
  const user = userDb.add({ name, password })

  const response: WSRequest<string> = {
    type: 'reg',
    data: JSON.stringify({
      name: user.name,
      index: user.id,
      error: false,
      errorText: '',
    }),
    id: 0,
  }

  ws.send(JSON.stringify(response))
}
