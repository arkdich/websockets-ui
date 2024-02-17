import { registerUser } from './register-user.ts'

export const routes = {
  reg: {
    type: 'reg',
    handler: registerUser,
  },
  update_winners: {
    type: 'update_winners',
    handler: async () => {},
  },
  create_room: {
    type: 'create_room',
    handler: async () => {},
  },
}
