'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Search, Bell, ChevronDown, LogOut } from 'lucide-react'

interface TopNavBarProps {
  currentUser?: {
    id: string
    name: string
    email: string
  } | null
}

export function TopNavBar({ currentUser }: TopNavBarProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      // Full reload to ensure cookie state is cleared everywhere
      window.location.href = '/login'
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="h-16 bg-white rounded-2xl shadow-sm flex items-center justify-between px-6 shrink-0">
      {/* Left: Message Label */}
      <div className="flex items-center gap-2.5">
        <MessageSquare className="w-5 h-5 text-gray-800" />
        <span className="font-semibold text-base text-gray-900">Message</span>
      </div>

      {/* Right: Search, Icons, Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-80 pl-10 pr-16 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>

        {/* Bell Icon */}
        <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-700" />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="h-9 px-3 flex items-center gap-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1.5 transition-colors"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id || 'current-user'}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && currentUser && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500 mt-1">{currentUser.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

