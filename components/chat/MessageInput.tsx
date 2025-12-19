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
    <div className=" py-1 sm:py-2 md:py-2 bg-white shrink-0">
      {/* Single border wrapper (input + icons + send) */}
      <div className="w-full rounded-full border border-gray-200 bg-white px-2 py-2 sm:py-2.5 flex items-center gap-1 focus-within:ring-2 focus-within:ring-[#2D9B98] focus-within:border-transparent">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type any message..."
          className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
        />

        <button
          type="button"
          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Voice"
        >
          <Mic className="w-5 h-5" strokeWidth={2} />
        </button>
        <button
          type="button"
          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Emoji"
        >
          <Smile className="w-5 h-5" strokeWidth={2} />
        </button>
        <button
          type="button"
          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Attach"
        >
          <Paperclip className="w-5 h-5" strokeWidth={2} />
        </button>

        <button
          onClick={onSendMessage}
          disabled={!messageInput.trim()}
          className="w-10 h-10 flex items-center justify-center bg-[#2D9B98] hover:bg-[#268784] text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send"
        >
          <Send className="w-5 h-5" strokeWidth={2} fill="white" />
        </button>
      </div>
    </div>
  )
}

