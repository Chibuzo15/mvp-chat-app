import { Info, X, ChevronDown } from 'lucide-react'
import { MessageMenuIcon, ArchiveIcon, MuteIcon, ExportIcon, ClearChatIcon, DeleteIcon } from '@/components/icons'
import { RefObject } from 'react'

interface ContextMenuProps {
  position: { x: number; y: number }
  menuRef: RefObject<HTMLDivElement>
  onContactInfo: () => void
}

export function ContextMenu({ position, menuRef, onContactInfo }: ContextMenuProps) {
  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      className="w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
    >
      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F3F3EE] transition-colors">
        <MessageMenuIcon className="w-4 h-4 text-[#111625]" />
        Mark as unread
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F3F3EE] transition-colors">
        <ArchiveIcon className="w-4 h-4 text-[#111625]" />
        Archive
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F3F3EE] transition-colors">
        <MuteIcon className="w-4 h-4 text-[#111625]" />
        <span className="flex-1 text-left">Mute</span>
        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
      </button>
      <button 
        onClick={onContactInfo}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F3F3EE] transition-colors"
      >
        <Info className="w-4 h-4" />
        Contact info
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F3F3EE] transition-colors">
        <ExportIcon className="w-4 h-4 text-[#111625]" />
        Export chat
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F3F3EE] transition-colors">
        <ClearChatIcon className="w-4 h-4 text-[#111625]" />
        Clear chat
      </button>
      <div className="border-t border-gray-200 my-1" />
      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#DF1C41] hover:bg-red-50 transition-colors">
        <DeleteIcon className="w-4 h-4 text-[#DF1C41]" />
        Delete chat
      </button>
    </div>
  )
}

