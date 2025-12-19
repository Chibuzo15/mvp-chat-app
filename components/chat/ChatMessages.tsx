import { Check, CheckCheck } from 'lucide-react'
import { RefObject } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface Message {
  id: string
  content: string
  senderId: string
  sessionId: string
  createdAt: string
  sender: User
  tempId?: string
}

interface ChatMessagesProps {
  messages: Message[]
  currentUserId: string | null
  loadingMessages: boolean
  messagesEndRef: RefObject<HTMLDivElement>
  formatTime: (date: string) => string
}

export function ChatMessages({ 
  messages, 
  currentUserId, 
  loadingMessages,
  messagesEndRef,
  formatTime 
}: ChatMessagesProps) {
  if (loadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p className="text-sm">No messages yet. Start the conversation!</p>
      </div>
    )
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: typeof messages }[] = []
  messages.forEach((message) => {
    const messageDate = new Date(message.createdAt)
    const today = new Date()
    const isToday = messageDate.toDateString() === today.toDateString()
    const dateLabel = isToday ? 'Today' : messageDate.toLocaleDateString()
    
    const existingGroup = groupedMessages.find(g => g.date === dateLabel)
    if (existingGroup) {
      existingGroup.messages.push(message)
    } else {
      groupedMessages.push({ date: dateLabel, messages: [message] })
    }
  })

  return (
    <>
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex}>
          {/* Date Divider */}
          <div className="flex items-center justify-center my-6">
            <div className="px-4 py-1 bg-gray-100 rounded-full">
              <span className="text-xs font-medium text-gray-500">{group.date}</span>
            </div>
          </div>

          {/* Messages */}
          {group.messages.map((message) => {
            const isOwn = message.senderId === currentUserId
            return (
              <div key={message.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} mb-4`}>
                <div className={`max-w-md rounded-2xl px-4 py-3 shadow-sm border border-gray-100 ${isOwn ? 'bg-[#F0FDF4]' : 'bg-white'}`}>
                  <p className="text-sm text-gray-800 leading-relaxed">{message.content}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs text-gray-400">
                    {formatTime(message.createdAt)}
                  </span>
                  {isOwn && (
                    message.tempId ? (
                      <Check className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
                    ) : (
                      <CheckCheck className="w-3.5 h-3.5 text-[#2D9B98]" strokeWidth={2} />
                    )
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </>
  )
}

