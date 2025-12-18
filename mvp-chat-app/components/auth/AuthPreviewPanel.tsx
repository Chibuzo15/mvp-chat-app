'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { MessageSquare, Sparkles, Radio, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

type Mode = 'login' | 'register'

type Scene = {
  eyebrow: string
  headline: string
  subhead: string
  chips: Array<{ label: string; tone: 'online' | 'offline' | 'ai' | 'secure' }>
  bubbles: Array<
    | { side: 'left'; name: string; text: string }
    | { side: 'right'; name?: never; text: string }
    | { side: 'typing'; name: string }
  >
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(!!media.matches)

    onChange()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    }

    // Safari fallback
    media.addListener(onChange)
    return () => media.removeListener(onChange)
  }, [])

  return reduced
}

function Chip({ label, tone }: { label: string; tone: Scene['chips'][number]['tone'] }) {
  const base =
    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold'

  if (tone === 'online') {
    return (
      <span className={cn(base, 'border-white/20 bg-white/10 text-white')}>
        <span className="h-1.5 w-1.5 rounded-full bg-[#7DE2CE]" />
        {label}
      </span>
    )
  }

  if (tone === 'offline') {
    return (
      <span className={cn(base, 'border-white/15 bg-black/10 text-white/90')}>
        <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        {label}
      </span>
    )
  }

  if (tone === 'secure') {
    return (
      <span className={cn(base, 'border-white/20 bg-white/10 text-white')}>
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </span>
    )
  }

  return (
    <span className={cn(base, 'border-white/20 bg-white/10 text-white')}>
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  )
}

function Bubble({ side, name, text }: { side: 'left' | 'right'; name?: string; text: string }) {
  const isLeft = side === 'left'
  return (
    <div className={cn('flex', isLeft ? 'justify-start' : 'justify-end')}>
      <div
        className={cn(
          // Match real chat bubble: white bubble + subtle border
          'max-w-md rounded-2xl px-4 py-3 text-sm shadow-sm border',
          isLeft ? 'bg-white text-gray-800 border-gray-100' : 'bg-white text-gray-800 border-gray-100'
        )}
      >
        {isLeft && name ? (
          <div className="mb-1 text-[11px] font-semibold text-gray-600">{name}</div>
        ) : null}
        <div className="leading-relaxed">{text}</div>
      </div>
    </div>
  )
}

function TypingBubble({
  name,
  reducedMotion,
  isActive,
}: {
  name: string
  reducedMotion: boolean
  isActive: boolean
}) {
  return (
    <div className="flex justify-start">
      <div className="max-w-md rounded-2xl bg-white px-4 py-3 text-sm shadow-sm border border-gray-100">
        <div className="mb-1 text-[11px] font-semibold text-gray-600">{name}</div>
        <div className="flex items-center gap-2 text-gray-600">
          <span>Typing</span>
          <span className="inline-flex items-center gap-1" aria-hidden="true">
            {[0, 150, 300].map((delay, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 w-1.5 rounded-full bg-gray-400',
                  reducedMotion || !isActive ? '' : 'animate-typing-dot'
                )}
                style={
                  reducedMotion
                    ? undefined
                    : ({ animationDelay: `${delay}ms` } satisfies CSSProperties)
                }
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}

export function AuthPreviewPanel({ mode }: { mode: Mode }) {
  const reducedMotion = usePrefersReducedMotion()
  const [isActive, setIsActive] = useState(true)

  const scenes = useMemo<Scene[]>(
    () => [
      {
        eyebrow: 'Live preview',
        headline: 'See who’s online. Start a session in one click.',
        subhead:
          'Presence is real-time (WebSocket). Chats persist automatically (Postgres).',
        chips: [
          { label: 'Alex online', tone: 'online' },
          { label: 'Jordan offline', tone: 'offline' },
          { label: 'WebSocket live', tone: 'online' },
        ],
        bubbles: [
          { side: 'left', name: 'Alex', text: 'Can you share the latest build link?' },
          { side: 'right', text: 'Yep — sending it now.' },
          { side: 'typing', name: 'Alex' },
        ],
      },
      {
        eyebrow: 'Saved sessions',
        headline: 'Your chat history stays with the session.',
        subhead:
          'Close the tab, come back later — your messages and sessions are still there.',
        chips: [
          { label: 'Sessions saved', tone: 'secure' },
          { label: 'History stored', tone: 'secure' },
          { label: 'Fast search later', tone: 'offline' },
        ],
        bubbles: [
          { side: 'left', name: 'Jordan', text: 'Where did we land on the API shape?' },
          { side: 'right', text: 'Pinned above. Keeping it in this session.' },
          { side: 'left', name: 'Jordan', text: 'Perfect — thanks.' },
        ],
      },
      {
        eyebrow: 'Bonus',
        headline: 'Chat with AI when you want a draft fast.',
        subhead:
          'Optional mode for quick summaries, replies, or brainstorming (no fluff).',
        chips: [
          { label: 'AI assistant', tone: 'ai' },
          { label: 'Optional', tone: 'offline' },
          { label: 'Private by default', tone: 'secure' },
        ],
        bubbles: [
          { side: 'left', name: 'AI', text: 'I can summarize this thread or draft a reply.' },
          { side: 'right', text: 'Summarize in 3 bullets.' },
          { side: 'left', name: 'AI', text: '1) Decisions… 2) Next steps… 3) Risks…' },
        ],
      },
    ],
    []
  )

  const [sceneIdx, setSceneIdx] = useState(0)
  const scene = scenes[sceneIdx]!

  useEffect(() => {
    if (reducedMotion) return

    let id: number | null = null

    const start = () => {
      if (id != null) return
      id = window.setInterval(() => {
        // Rotate slowly: re-render ~ every 5s (cheap) and pause when hidden.
        setSceneIdx((i) => (i + 1) % scenes.length)
      }, 5200)
    }

    const stop = () => {
      if (id == null) return
      window.clearInterval(id)
      id = null
    }

    const onVisibilityChange = () => {
      const active = typeof document !== 'undefined' && document.visibilityState === 'visible'
      setIsActive(active)
      if (active) start()
      else stop()
    }

    onVisibilityChange()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      stop()
    }
  }, [reducedMotion, scenes.length])

  return (
    <div className="relative h-full min-h-full">
      {/* Background: gradient + subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E9A80] to-[#167A67]" />
      <div className="absolute inset-0 opacity-20 auth-grid" aria-hidden="true" />
      <div
        className={cn(
          // Avoid huge blurred layers (expensive). Use a radial gradient blob instead.
          'pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full transform-gpu will-change-transform',
          '[background:radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_60%)]',
          reducedMotion || !isActive ? '' : 'animate-float-slow'
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute -bottom-32 -left-28 h-96 w-96 rounded-full transform-gpu will-change-transform',
          '[background:radial-gradient(circle_at_40%_40%,rgba(0,0,0,0.12),transparent_62%)]',
          reducedMotion || !isActive ? '' : 'animate-float-slower'
        )}
      />

      <div className="relative flex h-full min-h-full flex-col justify-between p-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
              <MessageSquare className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="text-white">
              <div className="text-lg font-bold leading-5">MVP Chat App</div>
              <div className="text-xs text-white/75">Shipped fast. Built clean.</div>
            </div>
          </div>

          <div className="mt-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/15">
              <Radio className="h-3.5 w-3.5" aria-hidden="true" />
              {scene.eyebrow}
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white">
              {scene.headline}
            </h1>
            <p className="mt-3 max-w-lg text-base text-white/85">{scene.subhead}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {scene.chips.map((c) => (
                <Chip key={c.label} label={c.label} tone={c.tone} />
              ))}
            </div>
          </div>

          <div className="mt-10">
            <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-[#F5F6ED] ring-1 ring-black/5 shadow-xl">
              {/* Cheap \"shine\" sweep (transform-only). Disabled when hidden/reduced motion. */}
              <div
                className={cn(
                  'pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent transform-gpu will-change-transform',
                  reducedMotion || !isActive ? 'opacity-0' : 'animate-shine-sweep opacity-70'
                )}
                aria-hidden="true"
              />
              <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
                <div className="text-sm font-semibold text-gray-900">Session preview</div>
                <div className="text-xs text-gray-500">
                  {mode === 'login' ? 'Sign in to resume' : 'Create an account to start'}
                </div>
              </div>

              <div className="space-y-3 px-5 py-5">
                {scene.bubbles.map((b, idx) => {
                  if (b.side === 'typing') {
                    return (
                      <TypingBubble
                        key={`${sceneIdx}-${idx}`}
                        name={b.name}
                        reducedMotion={reducedMotion}
                        isActive={isActive}
                      />
                    )
                  }

                  return (
                    <Bubble
                      key={`${sceneIdx}-${idx}`}
                      side={b.side}
                      name={'name' in b ? b.name : undefined}
                      text={b.text}
                    />
                  )
                })}
              </div>

              <div className="border-t border-black/5 px-5 py-4">
                <div className="text-xs text-gray-500">
                  Built to showcase: WebSockets, Prisma/Postgres, JWT auth — plus an AI mode.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs text-white/70">
          © 2024 MVP Chat App
        </div>
      </div>
    </div>
  )
}
