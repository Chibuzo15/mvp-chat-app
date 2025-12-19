import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureAiUser } from '@/lib/ai'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure the AI conversation always exists for every user so it can be shown
    // persistently in the conversations list.
    const aiUser = await ensureAiUser()
    if (aiUser.id !== userId) {
      const [smallerId, largerId] = [userId, aiUser.id].sort()
      await prisma.chatSession.upsert({
        where: { user1Id_user2Id: { user1Id: smallerId, user2Id: largerId } },
        update: {},
        create: { user1Id: smallerId, user2Id: largerId },
      })
    }

    const sessions = await prisma.chatSession.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const formattedSessions = await Promise.all(
      sessions.map(async (session) => {
        const isUser1 = session.user1Id === userId
        const lastReadAt = isUser1 ? session.lastReadAtUser1 : session.lastReadAtUser2

        const unreadCount = await prisma.message.count({
          where: {
            sessionId: session.id,
            createdAt: { gt: lastReadAt },
            // Only count incoming messages as unread
            senderId: { not: userId },
          },
        })

        return {
          id: session.id,
          otherUser: isUser1 ? session.user2 : session.user1,
          lastMessage: session.messages[0]?.content,
          timestamp: session.messages[0]?.createdAt || session.createdAt,
          unreadCount,
          otherLastReadAt: (isUser1 ? session.lastReadAtUser2 : session.lastReadAtUser1).toISOString(),
        }
      })
    )

    // Sort by last message time (most recent first), including AI chat
    const sorted = formattedSessions.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0
      return timeB - timeA // Descending order (newest first)
    })

    return NextResponse.json({ sessions: sorted })
  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

