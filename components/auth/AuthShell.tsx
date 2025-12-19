import type { ReactNode } from 'react'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { AuthPreviewPanel } from './AuthPreviewPanel'

type Mode = 'login' | 'register'

type Props = {
  mode: Mode
  children: ReactNode
}

export function AuthShell({ mode, children }: Props) {
  return (
    <div className="relative bg-slate-50 overscroll-none overflow-y-hidden">
      {/* Prevent white bounce/overscroll showing body background */}
      <div className="fixed inset-0 -z-10 bg-slate-50" aria-hidden="true" />

      <div className="grid lg:grid-cols-2">
        {/* Left: standout preview (grid makes it match right column height) */}
        <div className="hidden lg:block">
          <AuthPreviewPanel mode={mode} />
        </div>

        {/* Right: form */}
        <div className="flex items-center justify-center p-6 sm:p-8 bg-[radial-gradient(ellipse_at_top,_rgba(30,154,128,0.14),_transparent_55%)]">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#1E9A80] rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-5">MVP Chat App</div>
                <div className="text-xs text-slate-600">Live presence. Saved sessions.</div>
              </div>
            </div>

            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-2 rounded-[28px] bg-gradient-to-br from-[#1E9A80]/18 via-transparent to-slate-200/60 blur-xl"
                aria-hidden="true"
              />
              <div className="relative">{children}</div>
            </div>

            <p className="text-center text-xs text-slate-500 mt-6">
              By continuing, you agree to our{' '}
              <a href="#" className="text-[#1E9A80] hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[#1E9A80] hover:underline">Privacy Policy</a>
              .
            </p>

            <div className="mt-6 text-center text-xs text-slate-400">
              <span>Need a demo account?</span>{' '}
              <Link
                href={mode === 'login' ? '/register' : '/login'}
                className="text-slate-500 hover:text-slate-700"
              >
                {mode === 'login' ? 'Create one in 30 seconds' : 'Already have one? Sign in'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
