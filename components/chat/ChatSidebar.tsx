import { Home, MessageSquare, Compass, Folder, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react'

export function ChatSidebar() {
  return (
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

