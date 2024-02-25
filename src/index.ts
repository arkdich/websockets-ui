import 'dotenv/config'
import { httpServer } from './http-server/index.ts'
import { WebSocketServer } from 'ws'
import { Message } from './lib/Request_d.ts'
import { handleMessage } from './api/handle-ws-request.ts'

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
  console.log(
    `Client successfully connected, total clients: ${wsServer.clients.size}`
  )

  ws.on('message', (buffer) => {
    try {
      const request = JSON.parse(buffer.toString()) as Message<string>
      console.log('Client request:\n', request)

      handleMessage(ws, request.type, request.data)
    } catch (err: any) {
      ws.send(JSON.stringify({ message: err.message }))
    }
  })
})

export const getWsClients = () => {
  return wsServer.clients.values()
}
