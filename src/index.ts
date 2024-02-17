import 'dotenv/config'
import { httpServer } from './http-server/index.js'
import { WebSocket, WebSocketServer } from 'ws'
import { Registration, WSRequest } from './lib/Request_d.js'
import { UserDb } from './db/user-db.js'

const HTTP_PORT = Number(process.env.HTTP_PORT) || 8181
const WS_PORT = Number(process.env.WS_PORT) || 3000

httpServer.on('listening', () => {
  console.log(`Http server running at http://localhost:${HTTP_PORT}`)
})

httpServer.listen(HTTP_PORT)

const userDb = new UserDb()
const wsServer = new WebSocketServer({ port: WS_PORT })

wsServer.on('listening', () => {
  console.log(`Websocket server running at ws://localhost:${WS_PORT}`)
})

wsServer.on('connection', (server, req) => {
  server.on('message', (buffer) => {
    try {
      const { type, data } = JSON.parse(buffer.toString()) as WSRequest<string>

      if (type === 'reg') {
        const { name, password } = (
          typeof data === 'string' ? JSON.parse(data) : data
        ) as Registration

        console.log(data)
        console.log(name, password)

        if (!name || !password) {
          throw new Error('Invalid data')
        }

        const user = userDb.add({ name, password })

        const response: WSRequest<string> = {
          type: 'reg',
          data: JSON.stringify({
            name: user.name,
            index: 0,
            error: false,
            errorText: '',
          }),
          id: 0,
        }

        server.send(JSON.stringify(response))
      }
    } catch (err: any) {
      server.send(JSON.stringify({ message: err.message }))
    }
  })

  server.send(JSON.stringify({ message: 'Successfully connected' }))
})

// const client = new WebSocket('ws://localhost:3000')

// client
//   .on('open', () => {
//     console.log('Client connected')

//     client.send(
//       JSON.stringify({
//         type: 'reg',
//         data: { name: '22424242', password: '4242224' },
//         id: 0,
//       })
//     )
//   })
//   .on('message', (data) => {
//     console.log('Message from server:', data.toString())
//   })
