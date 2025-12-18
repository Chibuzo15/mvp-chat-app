import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { verifyToken } from './auth'
import { prisma } from './prisma'

interface ConnectedUser {
  userId: string
  socketId: string
}

// Track potentially multiple sockets per user (multi-tab / multi-device)
const userSockets = new Map<string, Set<string>>()
const isUserOnline = (userId: string) => (userSockets.get(userId)?.size || 0) > 0

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    path: '/api/socketio',
    addTrailingSlash: false,
  })

  io.use(async (socket, next) => {
    try {
      // Try to get token from auth first (for compatibility)
      let token = socket.handshake.auth.token
      
      // If not in auth, try to parse from cookies
      if (!token && socket.handshake.headers.cookie) {
        const cookies = socket.handshake.headers.cookie.split('; ')
        const authCookie = cookies.find(c => c.startsWith('auth-token='))
        if (authCookie) {
          token = authCookie.split('=')[1]
        }
      }
      
      if (!token) {
        return next(new Error('Authentication error'))
      }

      const payload = verifyToken(token)
      socket.data.userId = payload.userId
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    const userId = socket.data.userId

    const sockets = userSockets.get(userId) ?? new Set<string>()
    const wasOnline = sockets.size > 0
    sockets.add(socket.id)
    userSockets.set(userId, sockets)

    // Send current presence snapshot to the newly connected client
    socket.emit('presence-state', { onlineUserIds: Array.from(userSockets.keys()).filter(isUserOnline) })

    // Notify everyone only on the transition offline -> online
    if (!wasOnline) {
      io.emit('user-online', { userId })
    }

    socket.on('join-session', (sessionId: string) => {
      socket.join(sessionId)
    })

    socket.on('send-message', async (data: {
      sessionId: string
      content: string
      tempId: string
    }) => {
      try {
        const session = await prisma.chatSession.findUnique({
          where: { id: data.sessionId },
        })

        if (!session) {
          socket.emit('message-error', { tempId: data.tempId, error: 'Session not found' })
          return
        }

        if (session.user1Id !== userId && session.user2Id !== userId) {
          socket.emit('message-error', { tempId: data.tempId, error: 'Unauthorized' })
          return
        }

        const message = await prisma.message.create({
          data: {
            content: data.content,
            senderId: userId,
            sessionId: data.sessionId,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        })

        io.to(data.sessionId).emit('receive-message', {
          ...message,
          tempId: data.tempId,
        })
      } catch (error) {
        socket.emit('message-error', { tempId: data.tempId, error: 'Failed to send message' })
      }
    })

    socket.on('disconnect', () => {
      const sockets = userSockets.get(userId)
      if (sockets) {
        sockets.delete(socket.id)
        if (sockets.size === 0) {
          userSockets.delete(userId)
          io.emit('user-offline', { userId })
        } else {
          userSockets.set(userId, sockets)
        }
      }
    })
  })

  return io
}

