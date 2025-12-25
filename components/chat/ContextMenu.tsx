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
        paddingTop: '12px',
        paddingBottom: '12px',
      }}
      className="w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <button className="w-[calc(100%-24px)] mx-[12px] flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F3F3EE] transition-colors rounded">
        <MessageMenuIcon className="w-4 h-4 text-[#111625]" />
        Mark as unread
      </button>
      <button className="w-[calc(100%-24px)] mx-[12px] flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F3F3EE] transition-colors rounded">
        <ArchiveIcon className="w-4 h-4 text-[#111625]" />
        Archive
      </button>
      <button className="w-[calc(100%-24px)] mx-[12px] flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F3F3EE] transition-colors rounded">
        <MuteIcon className="w-4 h-4 text-[#111625]" />
        <span className="flex-1 text-left">Mute</span>
        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
      </button>
      <button 
        onClick={onContactInfo}
        className="w-[calc(100%-24px)] mx-[12px] flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F3F3EE] transition-colors rounded"
      >
        <Info className="w-4 h-4" />
        Contact info
      </button>
      <button className="w-[calc(100%-24px)] mx-[12px] flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F3F3EE] transition-colors rounded">
        <ExportIcon className="w-4 h-4 text-[#111625]" />
        Export chat
      </button>
      <button className="w-[calc(100%-24px)] mx-[12px] flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F3F3EE] transition-colors rounded">
        <ClearChatIcon className="w-4 h-4 text-[#111625]" />
        Clear chat
      </button>
      <div className=" my-1 mx-[12px]" />
      <button className="w-[calc(100%-24px)] mx-[12px] flex items-center gap-3 px-4 py-2 text-sm text-[#DF1C41] hover:bg-[#F3F3EE] transition-colors rounded">
        <DeleteIcon className="w-4 h-4 text-[#DF1C41]" />
        Delete chat
      </button>
    </div>
  )
}

