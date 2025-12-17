import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { verifyToken } from './auth'
import { prisma } from './prisma'

interface ConnectedUser {
  userId: string
  socketId: string
}

const connectedUsers = new Map<string, ConnectedUser>()

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    path: '/api/socketio',
    addTrailingSlash: false,
  })

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
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

    connectedUsers.set(userId, { userId, socketId: socket.id })
    io.emit('user-online', { userId })

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
        console.error('Send message error:', error)
        socket.emit('message-error', { tempId: data.tempId, error: 'Failed to send message' })
      }
    })

    socket.on('disconnect', () => {
      connectedUsers.delete(userId)
      io.emit('user-offline', { userId })
    })
  })

  return io
}

