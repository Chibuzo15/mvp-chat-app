'use client'

import { X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { LogoIcon, HomeIcon, ChatIcon, CompassIcon, FolderIcon, ImageIcon, SparklesIcon } from '@/components/icons'
import { ProfileModal } from './ProfileModal'

function SidebarContent({ variant }: { variant: 'desktop' | 'drawer' }) {
  const isDrawer = variant === 'drawer'
  return (
    <div
      className={
        isDrawer
          ? 'w-full bg-[#F3F3ED] h-full flex flex-col items-start px-5 py-6'
          : 'w-[88px] bg-[#F3F3ED] flex-col items-center py-6'
      }
    >
      {/* Logo */}
      <div className={isDrawer ? 'mb-8 flex items-center gap-3' : 'mb-8'}>
        <div className="w-[52px] h-[52px] bg-[#2D9B98] rounded-full flex items-center justify-center shadow-sm">
          <LogoIcon className="w-6 h-6" />
        </div>
        {isDrawer && <span className="font-semibold text-gray-900 text-lg">Menu</span>}
      </div>

      {/* Navigation Icons */}
      <div className={isDrawer ? 'flex-1 flex flex-col gap-3 w-full' : 'flex-1 flex flex-col gap-6 mt-1'}>
        <button
          className={
            isDrawer
              ? 'w-full h-12 flex items-center gap-3 px-3 rounded-xl text-gray-800 hover:bg-white/60 transition-colors'
              : 'w-[44px] h-[44px] flex items-center justify-center text-gray-800 hover:text-gray-900 transition-colors'
          }
        >
          <HomeIcon className={isDrawer ? 'w-5 h-5' : 'w-5 h-5'} />
          {isDrawer && <span className="text-sm font-medium">Home</span>}
        </button>
        <button
          className={
            isDrawer
              ? 'w-full h-12 flex items-center gap-3 px-3 rounded-xl text-[#1E9A80] bg-[#F0FDF4] border border-[#1E9A80] transition-colors'
              : 'w-[44px] h-[44px] flex items-center justify-center text-[#1E9A80] bg-[#F0FDF4] border border-[#1E9A80] rounded-lg transition-colors'
          }
        >
          <ChatIcon className={isDrawer ? 'w-5 h-5' : 'w-5 h-5'} />
          {isDrawer && <span className="text-sm font-semibold">Messages</span>}
        </button>
        <button
          className={
            isDrawer
              ? 'w-full h-12 flex items-center gap-3 px-3 rounded-xl text-gray-700 hover:bg-white/60 transition-colors'
              : 'w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors'
          }
        >
          <CompassIcon className="w-5 h-5" />
          {isDrawer && <span className="text-sm font-medium">Explore</span>}
        </button>
        <button
          className={
            isDrawer
              ? 'w-full h-12 flex items-center gap-3 px-3 rounded-xl text-gray-700 hover:bg-white/60 transition-colors'
              : 'w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors'
          }
        >
          <FolderIcon className="w-5 h-5" />
          {isDrawer && <span className="text-sm font-medium">Folders</span>}
        </button>
        <button
          className={
            isDrawer
              ? 'w-full h-12 flex items-center gap-3 px-3 rounded-xl text-gray-700 hover:bg-white/60 transition-colors'
              : 'w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors'
          }
        >
          <ImageIcon className="w-5 h-5" />
          {isDrawer && <span className="text-sm font-medium">Media</span>}
        </button>
      </div>

      {/* Bottom Section */}
      <div className={isDrawer ? 'flex flex-col gap-4 w-full' : 'flex flex-col gap-6 items-center mb-2'}>
        <button
          className={
            isDrawer
              ? 'w-full h-12 flex items-center gap-3 px-3 rounded-xl text-gray-700 hover:bg-white/60 transition-colors'
              : 'w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors'
          }
        >
          <SparklesIcon className="w-5 h-5" />
          {isDrawer && <span className="text-sm font-medium">AI</span>}
        </button>
        <div className={isDrawer ? 'flex items-center gap-3 px-3 py-2' : ''}>
          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden shrink-0">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {isDrawer && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Profile</p>
              <p className="text-xs text-gray-500 truncate">View account</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ChatSidebar() {
  const [showProfileModal, setShowProfileModal] = useState(false)
  const logoButtonRef = useRef<HTMLButtonElement>(null)
  const profileModalRef = useRef<HTMLDivElement>(null)

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileModalRef.current &&
        !profileModalRef.current.contains(event.target as Node) &&
        logoButtonRef.current &&
        !logoButtonRef.current.contains(event.target as Node)
      ) {
        setShowProfileModal(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Mock current user data - replace with actual user data
  const currentUser = {
    id: 'current-user',
    name: 'testing2',
    email: 'testing2@gmail.com'
  }

  return (
    // Desktop sidebar (md+) — restored to original layout/styles
    <div className="hidden md:flex w-[88px] bg-[#F3F3ED] flex-col items-center py-6 shrink-0">
      {/* Logo */}
      <div className="mb-8 relative">
        <button
          ref={logoButtonRef}
          onClick={() => setShowProfileModal(!showProfileModal)}
          className="w-[52px] h-[52px] bg-[#2D9B98] rounded-full flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          <LogoIcon className="w-6 h-6" />
        </button>
        {showProfileModal && (
          <ProfileModal
            user={currentUser}
            onClose={() => setShowProfileModal(false)}
            modalRef={profileModalRef}
          />
        )}
      </div>
    
      {/* Navigation Icons */}
      <div className="flex-1 flex flex-col gap-6 mt-1">
        <button className="w-[44px] h-[44px] flex items-center justify-center text-gray-800 hover:text-gray-900 transition-colors">
          <HomeIcon className="w-5 h-5" />
        </button>
        <button className="w-[44px] h-[44px] flex items-center justify-center text-[#1E9A80] bg-[#F0FDF4] border border-[#1E9A80] rounded-lg transition-colors">
          <ChatIcon className="w-5 h-5" />
        </button>
        <button className="w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors">
          <CompassIcon className="w-5 h-5" />
        </button>
        <button className="w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors">
          <FolderIcon className="w-5 h-5" />
        </button>
        <button className="w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors">
          <ImageIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-6 items-center mb-2">
        <button className="w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors">
          <SparklesIcon className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export function ChatSidebarDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <div className={`md:hidden fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={[
          'absolute left-0 top-0 h-full w-[280px] bg-[#F3F3ED] transition-transform duration-200 overflow-hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="h-full overflow-y-auto pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-end px-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center hover:bg-white/60 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>
          </div>
          <SidebarContent variant="drawer" />
          {/* Extra bottom padding for very short screens */}
          <div className="h-6" />
        </div>
      </div>
    </div>
  )
}

