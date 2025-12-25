'use client'

import { RefObject } from 'react'
import { BackIcon, RenameFileIcon, WinFreeCreditsIcon, ThemeStyleIcon, LogoutIcon } from '@/components/icons'

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
      className="absolute left-0 top-full mt-3 max-w-[307px] w-[307px] bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden"
    >
      {/* Go back to dashboard */}
      <button
        onClick={onClose}
        className="w-full px-4 py-4 text-left transition-colors flex items-center gap-3 bg-white"
      >
        <div className="w-7 h-7 flex items-center justify-center bg-[#F8F8F5] rounded-[6px]">
          <BackIcon className="w-1 h-2" />
        </div>
        <span className="text-base text-gray-900">Go back to dashboard</span>
      </button>

      {/* Rename file */}
      <button className="w-[calc(100%-2rem)] mx-4 px-4 py-4 text-left transition-colors flex items-center gap-3 bg-[#F8F8F5] rounded-lg">
        <div className="w-7 h-7 flex items-center justify-center bg-white rounded-[6px]">
          <RenameFileIcon className="w-[13px] h-[13px]" />
        </div>
        <span className="text-base text-gray-900">Rename file</span>
      </button>

      {/* User Info */}
      <div className="px-4 py-5 bg-white">
        <p className="text-xl font-semibold text-gray-900 mb-1" style={{ fontWeight: 600 }}>{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      {/* Credits Section */}
      <div className="w-[calc(100%-2rem)] mx-4 px-4 py-5 bg-[#F8F8F5] rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#8B8B8B]">Credits</span>
          <span className="text-sm text-[#8B8B8B]">Renews in</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl text-gray-900" style={{ fontWeight: 500 }}>20 left</span>
          <span className="text-xl text-gray-900" style={{ fontWeight: 500 }}>6h 24m</span>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="h-2 bg-[#E8E5DF] rounded-full overflow-hidden">
            <div className="h-full bg-[#1E9A80] rounded-full" style={{ width: '80%' }} />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">5 of 25 used today</span>
          <span className="text-sm text-[#3BA395] font-medium">+25 tomorrow</span>
        </div>
      </div>

      {/* Win free credits */}
      <button className="w-full px-4 py-4 text-left transition-colors flex items-center gap-3 bg-white">
        <div className="w-7 h-7 flex items-center justify-center bg-[#F8F8F5] rounded-[6px]">
          <WinFreeCreditsIcon className="w-[15px] h-[15px]" />
        </div>
        <span className="text-base text-gray-900">Win free credits</span>
      </button>

      {/* Theme Style */}
      <button className="w-full px-4 py-4 text-left transition-colors flex items-center gap-3 bg-white">
        <div className="w-7 h-7 flex items-center justify-center bg-[#F8F8F5] rounded-[6px]">
          <ThemeStyleIcon className="w-4 h-4" />
        </div>
        <span className="text-base text-gray-900">Theme Style</span>
      </button>

      {/* Log out */}
      <button
        onClick={handleLogout}
        className="w-full px-4 py-4 text-left transition-colors flex items-center gap-3 bg-white"
      >
        <div className="w-7 h-7 flex items-center justify-center bg-[#F8F8F5] rounded-[6px]">
          <LogoutIcon className="w-[14px] h-3" />
        </div>
        <span className="text-base text-gray-900">Log out</span>
      </button>
    </div>
  )
}

