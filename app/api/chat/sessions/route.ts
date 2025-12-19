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

    const formattedSessions = sessions.map(session => ({
      id: session.id,
      otherUser: session.user1Id === userId ? session.user2 : session.user1,
      lastMessage: session.messages[0]?.content,
      timestamp: session.messages[0]?.createdAt || session.createdAt,
    }))

    // Keep AI chat pinned at the top (even if it has no recent activity yet).
    const sorted = formattedSessions.slice().sort((a, b) => {
      const aIsAi = a.otherUser.email === 'ai@chat.app'
      const bIsAi = b.otherUser.email === 'ai@chat.app'
      if (aIsAi && !bIsAi) return -1
      if (!aIsAi && bIsAi) return 1
      // Otherwise keep server ordering (updatedAt desc) by not changing relative order.
      return 0
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

