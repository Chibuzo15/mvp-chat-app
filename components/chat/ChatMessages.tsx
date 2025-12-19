import { Check, CheckCheck } from 'lucide-react'
import { RefObject } from 'react'

function renderInlineMarkdown(text: string): React.ReactNode[] {
  // Very small, safe markdown subset: **bold**, *italic* / _italic_, `code`, [text](https://url)
  // No raw HTML is parsed or rendered.
  const nodes: React.ReactNode[] = []
  let remaining = text
  let key = 0

  const patterns: Array<{
    name: 'bold' | 'italicAsterisk' | 'italicUnderscore' | 'code' | 'link'
    regex: RegExp
  }> = [
    { name: 'link', regex: /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/ },
    { name: 'bold', regex: /\*\*([\s\S]+?)\*\*/ },
    { name: 'code', regex: /`([^`]+)`/ },
    { name: 'italicAsterisk', regex: /\*([^*\n]+)\*/ },
    { name: 'italicUnderscore', regex: /_([^_\n]+)_/ },
  ]

  while (remaining.length > 0) {
    let best:
      | { start: number; end: number; match: RegExpMatchArray; name: (typeof patterns)[number]['name'] }
      | null = null

    for (const p of patterns) {
      const m = remaining.match(p.regex)
      if (!m || m.index == null) continue
      const start = m.index
      const end = start + m[0].length
      if (!best || start < best.start) {
        best = { start, end, match: m, name: p.name }
      }
    }

    if (!best) {
      nodes.push(remaining)
      break
    }

    if (best.start > 0) {
      nodes.push(remaining.slice(0, best.start))
    }

    const full = best.match[0]
    const content = best.match[1]
    if (best.name === 'bold') {
      nodes.push(
        <strong key={`md-${key++}`} className="font-semibold">
          {renderInlineMarkdown(content)}
        </strong>
      )
    } else if (best.name === 'italicAsterisk' || best.name === 'italicUnderscore') {
      nodes.push(
        <em key={`md-${key++}`} className="italic">
          {renderInlineMarkdown(content)}
        </em>
      )
    } else if (best.name === 'code') {
      nodes.push(
        <code
          key={`md-${key++}`}
          className="px-1 py-0.5 rounded bg-gray-100 border border-gray-200 font-mono text-[0.85em]"
        >
          {content}
        </code>
      )
    } else if (best.name === 'link') {
      const label = best.match[1]
      const href = best.match[2]
      nodes.push(
        <a
          key={`md-${key++}`}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[#2D9B98] underline underline-offset-2 break-words"
        >
          {label}
        </a>
      )
    } else {
      // Fallback: render the raw match if something unexpected happens
      nodes.push(full)
    }

    remaining = remaining.slice(best.end)
  }

  return nodes
}

function renderMessageMarkdown(content: string): React.ReactNode {
  const lines = content.split('\n')
  const blocks: React.ReactNode[] = []
  let i = 0
  let blockKey = 0

  const isListItem = (line: string) => /^(\s*[-*])\s+/.test(line)
  const stripListMarker = (line: string) => line.replace(/^(\s*[-*])\s+/, '')

  while (i < lines.length) {
    // Skip empty lines (but keep spacing via <br/> between paragraphs)
    if (lines[i].trim() === '') {
      // Only add a spacer if the previous block isn't already a spacer
      blocks.push(<div key={`sp-${blockKey++}`} className="h-2" />)
      i++
      continue
    }

    // Lists (bullet only)
    if (isListItem(lines[i])) {
      const items: string[] = []
      while (i < lines.length && isListItem(lines[i])) {
        items.push(stripListMarker(lines[i]).trim())
        i++
      }
      blocks.push(
        <ul key={`ul-${blockKey++}`} className="list-disc pl-5 space-y-1">
          {items.map((t, idx) => (
            <li key={`li-${idx}`} className="break-words">
              {renderInlineMarkdown(t)}
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Paragraph: consume until blank line
    const para: string[] = []
    while (i < lines.length && lines[i].trim() !== '') {
      para.push(lines[i])
      i++
    }
    blocks.push(
      <p key={`p-${blockKey++}`} className="break-words">
        {para.map((line, idx) => (
          <span key={`ln-${idx}`}>
            {renderInlineMarkdown(line)}
            {idx < para.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    )
  }

  // If content was all whitespace
  if (blocks.length === 0) return null

  return <div className="space-y-2">{blocks}</div>
}

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
  readUpTo?: string
  loadingMessages: boolean
  messagesEndRef: RefObject<HTMLDivElement>
  formatTime: (date: string) => string
}

export function ChatMessages({ 
  messages, 
  currentUserId, 
  readUpTo,
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
            const isPending = !!message.tempId && message.id === message.tempId
            const msgTime = new Date(message.createdAt).getTime()
            const readTime = readUpTo ? new Date(readUpTo).getTime() : 0
            const isRead =
              !!readUpTo &&
              !!currentUserId &&
              isOwn &&
              !isPending &&
              msgTime <= readTime
            
            return (
              <div key={message.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} mb-4`}>
                <div className={`max-w-[85%] sm:max-w-md rounded-2xl px-4 py-3 shadow-sm border border-gray-100 ${isOwn ? 'bg-[#F0FDF4]' : 'bg-white'}`}>
                  <div className="text-sm text-gray-800 leading-relaxed">
                    {renderMessageMarkdown(message.content)}
                  </div>
                </div>
                <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs text-gray-400">
                    {formatTime(message.createdAt)}
                  </span>
                  {isOwn && (
                    isPending ? (
                      <Check className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
                    ) : (
                      <CheckCheck
                        className={`w-3.5 h-3.5 ${isRead ? 'text-[#2D9B98]' : 'text-gray-400'}`}
                        strokeWidth={2}
                      />
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

