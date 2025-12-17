import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetUserId } = await req.json()

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'targetUserId is required' },
        { status: 400 }
      )
    }

    if (targetUserId === userId) {
      return NextResponse.json(
        { error: 'Cannot start chat with yourself' },
        { status: 400 }
      )
    }

    const [smallerId, largerId] = [userId, targetUserId].sort()

    let session = await prisma.chatSession.findFirst({
      where: {
        OR: [
          { user1Id: smallerId, user2Id: largerId },
          { user1Id: largerId, user2Id: smallerId },
        ],
      },
    })

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          user1Id: smallerId,
          user2Id: largerId,
        },
      })
    }

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Start chat error:', error)
    return NextResponse.json(
      { error: 'Failed to start chat' },
      { status: 500 }
    )
  }
}

