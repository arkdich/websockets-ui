import 'dotenv/config'
import { httpServer } from './http-server/index.js'
import { WebSocketServer } from 'ws'
import { WSRequest } from './lib/Request_d.js'
import { handleWsRequest } from './api/handle-ws-request.js'

const HTTP_PORT = Number(process.env.HTTP_PORT) || 8181
const WS_PORT = Number(process.env.WS_PORT) || 3000

httpServer.on('listening', () => {
  console.log(`Http server running at http://localhost:${HTTP_PORT}`)
})

httpServer.listen(HTTP_PORT)

const wsServer = new WebSocketServer({ port: WS_PORT })

wsServer.on('listening', () => {
  console.log(`Websocket server running at ws://localhost:${WS_PORT}`)
})

wsServer.on('connection', (ws) => {
  ws.send(JSON.stringify({ message: 'Successfully connected' }))

  ws.on('message', (buffer) => {
    try {
      const { type, data } = JSON.parse(buffer.toString()) as WSRequest<string>

      handleWsRequest(ws, type, data)
    } catch (err: any) {
      ws.send(JSON.stringify({ message: err.message }))
    }
  })
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
