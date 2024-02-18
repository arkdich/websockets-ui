import { RequestType, Route } from '../lib/Request_d.ts'
import { createRoom } from './create-room.ts'
import { reg } from './reg.ts'

export const routes: Partial<Record<RequestType, Route>> = {
  reg: {
    type: 'reg',
    handler: reg,
  },
  create_room: {
    type: 'create_room',
    handler: createRoom,
  },
}
