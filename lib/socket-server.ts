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

// Allow API routes to emit to connected sockets (same Node process via custom `server.ts`).
let ioRef: SocketIOServer | null = null

export function emitToUserSockets(userId: string, event: string, payload: any) {
  const io = ioRef
  if (!io) return
  const sockets = userSockets.get(userId)
  if (!sockets || sockets.size === 0) return
  sockets.forEach((socketId) => {
    const s = io.sockets.sockets.get(socketId)
    if (!s) return
    s.emit(event, payload)
  })
}

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
  ioRef = io

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

    socket.on('leave-session', (sessionId: string) => {
      socket.leave(sessionId)
    })

    // Sync "read" state across all tabs/devices for the same user + notify the other participant for read-receipts.
    // Persisted to DB via ChatSession.lastReadAtUser{1,2} (not per-message read receipts).
    socket.on('mark-read', async (data: { sessionId: string }) => {
      try {
        if (!data?.sessionId) return
        const session = await prisma.chatSession.findUnique({
          where: { id: data.sessionId },
          select: { user1Id: true, user2Id: true },
        })
        if (!session) return
        if (session.user1Id !== userId && session.user2Id !== userId) return

        const now = new Date()
        const isUser1 = session.user1Id === userId
        await prisma.chatSession.update({
          where: { id: data.sessionId },
          data: isUser1 ? { lastReadAtUser1: now } : { lastReadAtUser2: now },
        })

        const sockets = userSockets.get(userId)
        if (!sockets || sockets.size === 0) return
        sockets.forEach((socketId) => {
          const s = io.sockets.sockets.get(socketId)
          if (!s) return
          s.emit('session-read', { sessionId: data.sessionId, readerId: userId, readAt: now.toISOString() })
        })

        // Notify the other participant's sockets so they can update tick marks in real-time.
        const otherUserId = session.user1Id === userId ? session.user2Id : session.user1Id
        const otherSockets = userSockets.get(otherUserId)
        if (otherSockets && otherSockets.size > 0) {
          otherSockets.forEach((socketId) => {
            const s = io.sockets.sockets.get(socketId)
            if (!s) return
            s.emit('session-read', { sessionId: data.sessionId, readerId: userId, readAt: now.toISOString() })
          })
        }
      } catch {
        // ignore
      }
    })

    socket.on('typing', async (data: { sessionId: string; isTyping: boolean }) => {
      try {
        if (!data?.sessionId) return
        const session = await prisma.chatSession.findUnique({
          where: { id: data.sessionId },
          select: { user1Id: true, user2Id: true },
        })
        if (!session) return
        if (session.user1Id !== userId && session.user2Id !== userId) return

        // Emit typing to the other participant's sockets (so the conversations list updates even if not in the room).
        const otherUserId = session.user1Id === userId ? session.user2Id : session.user1Id
        const otherSockets = userSockets.get(otherUserId)
        if (otherSockets && otherSockets.size > 0) {
          otherSockets.forEach((socketId) => {
            const s = io.sockets.sockets.get(socketId)
            if (!s) return
            s.emit('user-typing', {
              sessionId: data.sessionId,
              userId,
              isTyping: !!data.isTyping,
            })
          })
        }
      } catch {
        // Ignore typing errors to keep UX snappy.
      }
    })

    socket.on('send-message', async (data: {
      sessionId: string
      content: string
      tempId: string
    }) => {
      try {
        const session = await prisma.chatSession.findUnique({
          where: { id: data.sessionId },
          include: {
            user1: { select: { id: true, name: true, email: true } },
            user2: { select: { id: true, name: true, email: true } },
          },
        })

        if (!session) {
          socket.emit('message-error', { tempId: data.tempId, error: 'Session not found' })
          return
        }

        if (session.user1Id !== userId && session.user2Id !== userId) {
          socket.emit('message-error', { tempId: data.tempId, error: 'Unauthorized' })
          return
        }

        const now = new Date()
        const isSenderUser1 = session.user1Id === userId
        const [message] = await prisma.$transaction([
          prisma.message.create({
            data: {
              content: data.content,
              senderId: userId,
              sessionId: data.sessionId,
            },
            include: {
              sender: { select: { id: true, name: true, email: true } },
            },
          }),
          // Keep ChatSession ordering correct on refresh (sessions list uses updatedAt desc)
          prisma.chatSession.update({
            where: { id: data.sessionId },
            data: {
              updatedAt: now,
              // Sending implies the sender has "read up to now" on this conversation.
              ...(isSenderUser1 ? { lastReadAtUser1: now } : { lastReadAtUser2: now }),
            },
          }),
        ])

        // Deliver the message to ALL sockets of BOTH participants (multi-tab / multi-device),
        // regardless of whether they previously joined a room. This prevents missed messages
        // and makes unread counts reliable.
        const participantSocketIds = new Set<string>()
        const u1Sockets = userSockets.get(session.user1Id)
        const u2Sockets = userSockets.get(session.user2Id)
        u1Sockets?.forEach((id) => participantSocketIds.add(id))
        u2Sockets?.forEach((id) => participantSocketIds.add(id))

        participantSocketIds.forEach((socketId) => {
          const s = io.sockets.sockets.get(socketId)
          if (!s) return
          s.emit('receive-message', { ...message, tempId: data.tempId })
        })

        // Sending a message implies the sender is no longer typing (notify the other participant's sockets).
        const otherUserId = session.user1Id === userId ? session.user2Id : session.user1Id
        const otherSockets = userSockets.get(otherUserId)
        if (otherSockets && otherSockets.size > 0) {
          otherSockets.forEach((socketId) => {
            const s = io.sockets.sockets.get(socketId)
            if (!s) return
            s.emit('user-typing', { sessionId: data.sessionId, userId, isTyping: false })
          })
        }

        // NOTE: we intentionally do not broadcast via `io.to(sessionId)` to avoid duplicates
        // when a socket has joined multiple rooms over time.
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

