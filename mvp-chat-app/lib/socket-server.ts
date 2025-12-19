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
  console.log('[Socket] init', process.env.JWT_SECRET ? '(JWT_SECRET loaded)' : '(JWT_SECRET missing)')

  const io = new SocketIOServer(httpServer, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      credentials: true,
    },
  })

  const extractCookie = (cookieHeader: unknown, name: string): string | null => {
    if (typeof cookieHeader !== 'string' || !cookieHeader) return null
    const parts = cookieHeader.split(';').map((p) => p.trim())
    const match = parts.find((p) => p.startsWith(`${name}=`))
    if (!match) return null
    const raw = match.slice(name.length + 1).trim().replace(/^"|"$/g, '')
    try {
      return decodeURIComponent(raw)
    } catch {
      return raw
    }
  }

  io.use(async (socket, next) => {
    try {
      // Try to get token from auth first (for compatibility)
      let token = socket.handshake.auth.token
      
      // If not in auth, try to parse from cookies
      if (!token) {
        const cookieHeader =
          // Most common
          socket.handshake.headers?.cookie ??
          // Some engines expose headers here
          (socket.request as any)?.headers?.cookie

        const fromCookie = extractCookie(cookieHeader, 'auth-token')
        if (fromCookie) token = fromCookie
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

