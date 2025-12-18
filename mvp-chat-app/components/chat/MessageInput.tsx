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
    <div className="px-6 py-4 bg-white shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type any message..."
            className="w-full px-4 py-3 text-sm text-gray-700 bg-white border-none focus:outline-none placeholder:text-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors">
            <Mic className="w-5 h-5" strokeWidth={2} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors">
            <Smile className="w-5 h-5" strokeWidth={2} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors">
            <Paperclip className="w-5 h-5" strokeWidth={2} />
          </button>
          <button
            onClick={onSendMessage}
            disabled={!messageInput.trim()}
            className="w-10 h-10 flex items-center justify-center bg-[#2D9B98] hover:bg-[#268784] text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" strokeWidth={2} fill="white" />
          </button>
        </div>
      </div>
    </div>
  )
}

