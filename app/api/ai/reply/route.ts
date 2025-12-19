import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureAiUser } from '@/lib/ai'

export const dynamic = 'force-dynamic'

const GEMINI_MODEL = 'gemini-1.5-flash'

function extractGeminiText(data: any): string {
  const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join('')
  return typeof text === 'string' ? text.trim() : ''
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing GEMINI_API_KEY' },
        { status: 500 }
      )
    }

    const { sessionId, message } = await req.json()

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }

    if (message.length > 6000) {
      return NextResponse.json({ error: 'message is too long' }, { status: 400 })
    }

    const aiUser = await ensureAiUser()

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { id: true, user1Id: true, user2Id: true },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const participants = new Set([session.user1Id, session.user2Id])
    if (!participants.has(userId) || !participants.has(aiUser.id)) {
      return NextResponse.json({ error: 'Not an AI session' }, { status: 403 })
    }

    const userMessage = await prisma.message.create({
      data: {
        content: message.trim(),
        senderId: userId,
        sessionId,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
      },
    })

    const recent = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { content: true, senderId: true },
    })

    const contents = recent
      .reverse()
      .map((m) => ({
        role: m.senderId === aiUser.id ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 512,
          },
        }),
      }
    )

    const geminiData = await geminiRes.json().catch(() => ({}))

    if (!geminiRes.ok) {
      return NextResponse.json(
        { error: geminiData?.error?.message || 'Gemini request failed' },
        { status: 502 }
      )
    }

    const reply = extractGeminiText(geminiData)

    if (!reply) {
      return NextResponse.json(
        { error: 'Empty response from Gemini' },
        { status: 502 }
      )
    }

    const assistantMessage = await prisma.message.create({
      data: {
        content: reply,
        senderId: aiUser.id,
        sessionId,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json({ userMessage, assistantMessage })
  } catch (error) {
    console.error('AI reply error:', error)
    return NextResponse.json({ error: 'AI reply failed' }, { status: 500 })
  }
}


