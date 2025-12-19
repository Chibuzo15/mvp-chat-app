import { Home, MessageSquare, Compass, Folder, Image as ImageIcon, Sparkles, RefreshCw, X } from 'lucide-react'

function SidebarContent({ variant }: { variant: 'desktop' | 'drawer' }) {
  const isDrawer = variant === 'drawer'
  return (
    <div
      className={
        isDrawer
          ? 'w-full bg-[#F5F3F0] h-full flex flex-col items-start px-5 py-6'
          : 'w-[88px] bg-[#F5F3F0] flex-col items-center py-6'
      }
    >
      {/* Logo */}
      <div className={isDrawer ? 'mb-8 flex items-center gap-3' : 'mb-8'}>
        <div className="w-[52px] h-[52px] bg-[#2D9B98] rounded-full flex items-center justify-center shadow-sm">
          <RefreshCw className="w-6 h-6 text-white" strokeWidth={2.5} />
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
          <Home className={isDrawer ? 'w-[22px] h-[22px]' : 'w-[22px] h-[22px]'} fill="currentColor" strokeWidth={0} />
          {isDrawer && <span className="text-sm font-medium">Home</span>}
        </button>
        <button
          className={
            isDrawer
              ? 'w-full h-12 flex items-center gap-3 px-3 rounded-xl text-[#2D9B98] bg-[#E0F2F1] transition-colors'
              : 'w-[52px] h-[52px] flex items-center justify-center text-[#2D9B98] bg-[#E0F2F1] rounded-[18px] transition-colors'
          }
        >
          <MessageSquare className={isDrawer ? 'w-[24px] h-[24px]' : 'w-[24px] h-[24px]'} strokeWidth={2} />
          {isDrawer && <span className="text-sm font-semibold">Messages</span>}
        </button>
        <button
          className={
            isDrawer
              ? 'w-full h-12 flex items-center gap-3 px-3 rounded-xl text-gray-700 hover:bg-white/60 transition-colors'
              : 'w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors'
          }
        >
          <Compass className="w-[22px] h-[22px]" strokeWidth={2} />
          {isDrawer && <span className="text-sm font-medium">Explore</span>}
        </button>
        <button
          className={
            isDrawer
              ? 'w-full h-12 flex items-center gap-3 px-3 rounded-xl text-gray-700 hover:bg-white/60 transition-colors'
              : 'w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors'
          }
        >
          <Folder className="w-[22px] h-[22px]" strokeWidth={2} />
          {isDrawer && <span className="text-sm font-medium">Folders</span>}
        </button>
        <button
          className={
            isDrawer
              ? 'w-full h-12 flex items-center gap-3 px-3 rounded-xl text-gray-700 hover:bg-white/60 transition-colors'
              : 'w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors'
          }
        >
          <ImageIcon className="w-[22px] h-[22px]" strokeWidth={2} />
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
          <Sparkles className="w-[22px] h-[22px]" strokeWidth={2} />
          {isDrawer && <span className="text-sm font-medium">AI</span>}
        </button>
        <div className={isDrawer ? 'flex items-center gap-3 px-3 py-2' : 'w-[48px] h-[48px] rounded-full overflow-hidden border-[3px] border-[#F59E0B] shadow-sm'}>
          <div className="w-[48px] h-[48px] rounded-full overflow-hidden border-[3px] border-[#F59E0B] shadow-sm shrink-0">
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
  return (
    // Desktop sidebar (md+) — restored to original layout/styles
    <div className="hidden md:flex w-[88px] bg-[#F5F3F0] flex-col items-center py-6 shrink-0 border-r border-[#E8E5E1]">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-[52px] h-[52px] bg-[#2D9B98] rounded-full flex items-center justify-center shadow-sm">
          <RefreshCw className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
      </div>
    
      {/* Navigation Icons */}
      <div className="flex-1 flex flex-col gap-6 mt-1">
        <button className="w-[44px] h-[44px] flex items-center justify-center text-gray-800 hover:text-gray-900 transition-colors">
          <Home className="w-[22px] h-[22px]" fill="currentColor" strokeWidth={0} />
        </button>
        <button className="w-[52px] h-[52px] flex items-center justify-center text-[#2D9B98] bg-[#E0F2F1] rounded-[18px] transition-colors">
          <MessageSquare className="w-[24px] h-[24px]" strokeWidth={2} />
        </button>
        <button className="w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors">
          <Compass className="w-[22px] h-[22px]" strokeWidth={2} />
        </button>
        <button className="w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors">
          <Folder className="w-[22px] h-[22px]" strokeWidth={2} />
        </button>
        <button className="w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors">
          <ImageIcon className="w-[22px] h-[22px]" strokeWidth={2} />
        </button>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-6 items-center mb-2">
        <button className="w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors">
          <Sparkles className="w-[22px] h-[22px]" strokeWidth={2} />
        </button>
        <div className="w-[48px] h-[48px] rounded-full overflow-hidden border-[3px] border-[#F59E0B] shadow-sm">
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
          'absolute left-0 top-0 h-full w-[280px] bg-[#F5F3F0] border-r border-[#E8E5E1] transition-transform duration-200 overflow-hidden',
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

