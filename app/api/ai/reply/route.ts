import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureAiUser } from '@/lib/ai'

export const dynamic = 'force-dynamic'

// Default model candidates (order matters). We’ll auto-fallback at runtime by
// calling ListModels if the configured/default model isn’t available.
const DEFAULT_GEMINI_MODEL_CANDIDATES = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro',
]

let cachedResolvedModel: string | null = null
let cachedSupportedModels: string[] | null = null

function normalizeModelName(model: string): string {
  // Accept either "gemini-..." or "models/gemini-..."
  return model.startsWith('models/') ? model : `models/${model}`
}

function getGenerateContentUrl(model: string, apiKey: string) {
  return `https://generativelanguage.googleapis.com/v1beta/${normalizeModelName(model)}:generateContent?key=${apiKey}`
}

function isModelNotFoundOrUnsupportedError(message: string | undefined): boolean {
  const m = (message || '').toLowerCase()
  return (
    m.includes('is not found') ||
    m.includes('not supported') ||
    m.includes('unsupported') ||
    m.includes('call listmodels')
  )
}

async function listSupportedGenerateContentModels(apiKey: string): Promise<string[]> {
  if (cachedSupportedModels !== null) return cachedSupportedModels

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    { method: 'GET' }
  )

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    // Don't fail the whole request just because model listing failed.
    console.warn('Gemini ListModels failed:', data?.error?.message || res.status)
    cachedSupportedModels = []
    return []
  }

  const models = Array.isArray(data?.models) ? data.models : []
  const supportedModels: string[] = models
    .filter((m: any) => Array.isArray(m?.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
    .map((m: any) => (typeof m?.name === 'string' ? m.name.replace(/^models\//, '') : null))
    .filter((name: string | null): name is string => name !== null)
  
  cachedSupportedModels = supportedModels
  return supportedModels
}

async function generateWithModel(params: {
  apiKey: string
  model: string
  contents: any[]
}) {
  const { apiKey, model, contents } = params

  const res = await fetch(getGenerateContentUrl(model, apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    }),
  })

  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

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

    const envModel = process.env.GEMINI_MODEL?.trim()
    const preferredModels = Array.from(
      new Set(
        [envModel, cachedResolvedModel, ...DEFAULT_GEMINI_MODEL_CANDIDATES].filter(Boolean) as string[]
      )
    )

    let geminiData: any = null
    let lastErrorMsg: string | undefined
    let lastStatus: number | undefined
    let usedModel: string | null = null

    // First pass: try configured + cached + defaults.
    for (const model of preferredModels) {
      const attempt = await generateWithModel({ apiKey, model, contents })
      if (attempt.ok) {
        geminiData = attempt.data
        usedModel = model
        cachedResolvedModel = model
        break
      }

      lastStatus = attempt.status
      lastErrorMsg = attempt.data?.error?.message || 'Gemini request failed'
      if (!isModelNotFoundOrUnsupportedError(lastErrorMsg)) {
        break
      }
    }

    // Second pass: if it looks like a model-availability issue, call ListModels and retry with a supported model.
    if (!geminiData && isModelNotFoundOrUnsupportedError(lastErrorMsg)) {
      const supported = await listSupportedGenerateContentModels(apiKey)
      for (const model of supported) {
        const attempt = await generateWithModel({ apiKey, model, contents })
        if (attempt.ok) {
          geminiData = attempt.data
          usedModel = model
          cachedResolvedModel = model
          break
        }

        lastStatus = attempt.status
        lastErrorMsg = attempt.data?.error?.message || 'Gemini request failed'
        // If a supported model still fails with a non-model error, stop and surface it.
        if (!isModelNotFoundOrUnsupportedError(lastErrorMsg)) {
          break
        }
      }
    }

    if (!geminiData) {
      console.warn('Gemini request failed', { status: lastStatus, modelTried: usedModel, error: lastErrorMsg })
      return NextResponse.json({ error: lastErrorMsg || 'Gemini request failed' }, { status: 502 })
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


