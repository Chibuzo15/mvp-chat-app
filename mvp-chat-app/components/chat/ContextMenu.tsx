import { MessageSquare, Archive, Volume2, Info, Upload, X, Trash2, ChevronDown } from 'lucide-react'
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
      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
        <MessageSquare className="w-4 h-4" />
        Mark as unread
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
        <Archive className="w-4 h-4" />
        Archive
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
        <Volume2 className="w-4 h-4" />
        <span className="flex-1 text-left">Mute</span>
        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
      </button>
      <button 
        onClick={onContactInfo}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Info className="w-4 h-4" />
        Contact info
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
        <Upload className="w-4 h-4" />
        Export chat
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
        <X className="w-4 h-4" />
        Clear chat
      </button>
      <div className="border-t border-gray-200 my-1" />
      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
        <Trash2 className="w-4 h-4" />
        Delete chat
      </button>
    </div>
  )
}

