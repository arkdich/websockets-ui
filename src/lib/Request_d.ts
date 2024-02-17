export type WSRequest<Body = unknown> = {
  type: RequestType
  data: Body
  id: 0
}

export type RequestType = 'reg'

export type Registration = {
  name: string
  password: string
}

export type RegistrationResponse = {
  name: string
  index: number
  error: boolean
  errorText: string
}
