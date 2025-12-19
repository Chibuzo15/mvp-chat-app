import { Send, Smile, Paperclip, Mic } from 'lucide-react'

interface MessageInputProps {
  messageInput: string
  onMessageChange: (value: string) => void
  onSendMessage: () => void
}

export function MessageInput({ messageInput, onMessageChange, onSendMessage }: MessageInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSendMessage()
    }
  }

  return (
    <div className="px-2 sm:px-4 md:pr-6 md:pl-0 py-2 sm:py-3 md:py-4 bg-white shrink-0">
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
        <div className="flex-1 relative min-w-0">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type any message..."
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2D9B98] focus:border-transparent placeholder:text-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-3 shrink-0">
          <button className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors">
            <Mic className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" strokeWidth={2} />
          </button>
          <button className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors">
            <Smile className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" strokeWidth={2} />
          </button>
          <button className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors">
            <Paperclip className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" strokeWidth={2} />
          </button>
          <button
            onClick={onSendMessage}
            disabled={!messageInput.trim()}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center bg-[#2D9B98] hover:bg-[#268784] text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" strokeWidth={2} fill="white" />
          </button>
        </div>
      </div>
    </div>
  )
}

