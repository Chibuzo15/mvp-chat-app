'use client'

import { ChevronLeft, Edit3, Gift, Sun, LogOut } from 'lucide-react'
import { RefObject } from 'react'

interface ProfileModalProps {
  user: {
    id: string
    name: string
    email: string
  }
  onClose: () => void
  modalRef: RefObject<HTMLDivElement>
}

export function ProfileModal({ user, onClose, modalRef }: ProfileModalProps) {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      window.location.href = '/login'
    }
  }

  return (
    <div
      ref={modalRef}
      className="absolute left-0 top-full mt-3 w-[512px] bg-white rounded-[20px] shadow-2xl border border-gray-200 z-50 overflow-hidden"
    >
      {/* Go back to dashboard */}
      <button
        onClick={onClose}
        className="w-full px-8 py-5 flex items-center gap-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700 shrink-0" strokeWidth={2} />
        <span className="text-base font-normal text-gray-900">Go back to dashboard</span>
      </button>

      {/* Rename file */}
      <button className="w-full px-8 py-5 flex items-center gap-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left">
        <Edit3 className="w-5 h-5 text-gray-700 shrink-0" strokeWidth={2} />
        <span className="text-base font-normal text-gray-900">Rename file</span>
      </button>

      {/* User Info & Credits Section */}
      <div className="px-8 py-6 border-b border-gray-100">
        {/* User Info */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-1.5 leading-tight">{user.name}</h3>
          <p className="text-base text-gray-500 leading-relaxed">{user.email}</p>
        </div>

        {/* Credits Section */}
        <div className="space-y-3">
          {/* Credits and Renews */}
          <div className="flex items-start justify-between mb-3.5">
            <div>
              <p className="text-sm text-gray-500 mb-1.5 leading-tight">Credits</p>
              <p className="text-[28px] font-semibold text-gray-900 leading-none">20 left</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1.5 leading-tight">Renews in</p>
              <p className="text-[28px] font-semibold text-gray-900 leading-none">6h 24m</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div 
              className="absolute left-0 top-0 h-full bg-[#1E9A80] rounded-full transition-all"
              style={{ width: '80%' }}
            />
          </div>

          {/* Usage Info */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">5 of 25 used today</span>
            <span className="text-[#1E9A80] font-medium">+25 tomorrow</span>
          </div>
        </div>
      </div>

      {/* Win free credits */}
      <button className="w-full px-8 py-5 flex items-center gap-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left">
        <Gift className="w-5 h-5 text-gray-700 shrink-0" strokeWidth={2} />
        <span className="text-base font-normal text-gray-900">Win free credits</span>
      </button>

      {/* Theme Style */}
      <button className="w-full px-8 py-5 flex items-center gap-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left">
        <Sun className="w-5 h-5 text-gray-700 shrink-0" strokeWidth={2} />
        <span className="text-base font-normal text-gray-900">Theme Style</span>
      </button>

      {/* Log out */}
      <button
        onClick={handleLogout}
        className="w-full px-8 py-5 flex items-center gap-3.5 hover:bg-gray-50 transition-colors text-left"
      >
        <LogOut className="w-5 h-5 text-gray-700 shrink-0" strokeWidth={2} />
        <span className="text-base font-normal text-gray-900">Log out</span>
      </button>
    </div>
  )
}

