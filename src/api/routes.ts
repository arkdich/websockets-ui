import { MessageType, Route } from '../lib/Request_d.ts'
import { addShips } from './add-ships.ts'
import { addUserToRoom } from './add-user-to-room.ts'
import { attack } from './attack.ts'
import { createRoom } from './create-room.ts'
import { randomAttack } from './random-attack.ts'
import { reg } from './reg.ts'

export const routes: Partial<Record<MessageType, Route>> = {
  reg: {
    type: 'reg',
    handler: reg,
  },
  create_room: {
    type: 'create_room',
    handler: createRoom,
  },

  add_user_to_room: {
    type: 'add_user_to_room',
    handler: addUserToRoom,
  },
  add_ships: {
    type: 'add_ships',
    handler: addShips,
  },
  attack: {
    type: 'attack',
    handler: attack,
  },
  randomAttack: {
    type: 'randomAttack',
    handler: randomAttack,
  },
}
