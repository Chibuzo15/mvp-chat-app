import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = (token?: string): Socket => {
  const nextUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'
  const currentToken =
    socket && typeof (socket as any).auth === 'object' ? (socket as any).auth?.token : undefined

  // If token changes (or socket doesn't exist yet), recreate the connection so
  // the handshake consistently includes auth payload.
  if (!socket || (token && token !== currentToken)) {
    if (socket) {
      socket.disconnect()
      socket = null
    }

    socket = io(nextUrl, {
      path: '/api/socketio',
      // Allow initial HTTP handshake (cookie-friendly) then upgrade to WebSocket.
      // This is still a WebSocket app (Socket.IO will upgrade when possible).
      transports: ['polling', 'websocket'],
      // Ensure cookies are included when socket URL differs from app origin (e.g. Render/Railway)
      withCredentials: true,
      autoConnect: false,
      auth: token ? { token } : undefined,
    })
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

