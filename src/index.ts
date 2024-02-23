import 'dotenv/config'
import { httpServer } from './http-server/index.ts'
import { WebSocketServer } from 'ws'
import { WSRequest } from './lib/Request_d.ts'
import { handleWsRequest } from './api/handle-ws-request.ts'

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
