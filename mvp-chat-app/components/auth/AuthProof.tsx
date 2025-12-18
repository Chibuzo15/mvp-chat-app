import { CheckCircle2, Database, Radio, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

type ProofItem = {
  icon: ReactNode
  title: string
  description: string
}

export function AuthProof({ showAiTeaser = true }: { showAiTeaser?: boolean }) {
  const items: ProofItem[] = [
    {
      icon: <Radio className="h-4 w-4" aria-hidden="true" />,
      title: 'Live presence',
      description: 'Online/offline status via WebSockets',
    },
    {
      icon: <Database className="h-4 w-4" aria-hidden="true" />,
      title: 'History saved',
      description: 'Sessions + messages stored in Postgres',
    },
    ...(showAiTeaser
      ? [
          {
            icon: <Sparkles className="h-4 w-4" aria-hidden="true" />,
            title: 'Chat with AI',
            description: 'Bonus mode when you want it',
          },
        ]
      : []),
    {
      icon: <CheckCircle2 className="h-4 w-4" aria-hidden="true" />,
      title: 'Simple auth',
      description: 'JWT cookie session (no friction)',
    },
  ]

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-slate-200 bg-white/70 p-3 shadow-sm"
        >
          <div className="flex items-start gap-2">
            <div className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
              {item.icon}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 leading-5">
                {item.title}
              </div>
              <div className="text-xs text-slate-600 leading-4">{item.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
