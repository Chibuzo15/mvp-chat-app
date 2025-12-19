import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

const AI_EMAIL = 'ai@chat.app'
const AI_NAME = 'AI Chat'

export async function ensureAiUser() {
  const existing = await prisma.user.findUnique({ where: { email: AI_EMAIL } })
  if (existing) return existing

  try {
    const password = await hashPassword(`ai-placeholder-${Date.now()}`)
    return await prisma.user.create({
      data: {
        email: AI_EMAIL,
        name: AI_NAME,
        password,
      },
    })
  } catch (err) {
    // In case of race (unique constraint), fetch again.
    const user = await prisma.user.findUnique({ where: { email: AI_EMAIL } })
    if (!user) throw err
    return user
  }
}


