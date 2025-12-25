'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, LogOut, Menu } from 'lucide-react'
import { MessageIcon, BellIcon, SettingsIcon, SearchIcon } from '@/components/icons'

interface TopNavBarProps {
  currentUser?: {
    id: string
    name: string
    email: string
  } | null
  onToggleSidebar?: () => void
}

export function TopNavBar({ currentUser, onToggleSidebar }: TopNavBarProps) {
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
    <div className="bg-white rounded-2xl shadow-sm shrink-0">
      {/* Mobile layout (keeps current mobile UI) */}
      <div className="sm:hidden px-3">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="md:hidden w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-800" />
            </button>
            <MessageIcon className="w-5 h-5 text-[#596881] shrink-0" />
            <span className="hidden sm:inline font-semibold text-base text-gray-900 truncate">Message</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="w-9 h-9 flex items-center justify-center border border-[#E8E5DF] bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <BellIcon className="w-5 h-5 text-[#262626]" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center border border-[#E8E5DF] bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <SettingsIcon className="w-5 h-5 text-[#262626]" />
            </button>

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
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {showDropdown && currentUser && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pb-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Desktop/tablet layout (restore previous large screen view) */}
      <div className="hidden sm:flex h-16 items-center justify-between px-4">
        {/* Left: Message Label */}
        <div className="flex items-center gap-2.5">
          <MessageIcon className="w-5 h-5 text-[#596881] flex-shrink-0" />
          <span className="font-semibold text-base text-gray-900">Message</span>
        </div>

        {/* Right: Search, Icons, Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-40 sm:w-64 md:w-80 pl-10 pr-10 sm:pr-16 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
            />
            <div className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-[2px] px-2 py-0.5 bg-[#F3F3EE] rounded text-xs text-gray-500">
              <span>⌘</span>
              <span>+</span>
              <span>K</span>
            </div>
          </div>

          {/* Bell and Settings Icons */}
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center border border-[#E8E5DF] bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <BellIcon className="w-5 h-5 text-[#262626]" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center border border-[#E8E5DF] bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <SettingsIcon className="w-5 h-5 text-[#262626]" />
            </button>
          </div>

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
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

