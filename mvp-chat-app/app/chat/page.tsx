'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getSocket, disconnectSocket } from '@/lib/socket-client'
import { MessageSquare, X } from 'lucide-react'
import { 
  ChatSidebar,
  TopNavBar,
  ConversationsList,
  ChatHeader,
  ChatMessages,
  MessageInput,
  ContactInfoModal,
  ContextMenu
} from '@/components/chat'

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

interface Session {
  id: string
  otherUser: User
  lastMessage?: string
  timestamp?: string
  unreadCount?: number
}

export default function ChatPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null) // draft chat (no DB session yet)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [socketConnected, setSocketConnected] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [aiTyping, setAiTyping] = useState(false)
  const [swipedSession, setSwipedSession] = useState<string | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  const socketRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const newMessageButtonRef = useRef<HTMLButtonElement>(null)
  const newMessageDropdownRef = useRef<HTMLDivElement>(null)
  const selectedSessionIdRef = useRef<string | null>(null)
  const currentUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    selectedSessionIdRef.current = selectedSession?.id ?? null
  }, [selectedSession])

  useEffect(() => {
    currentUserIdRef.current = currentUserId
  }, [currentUserId])

  // Ensure we join the currently selected room once the socket is connected
  useEffect(() => {
    if (!socketConnected) return
    if (!socketRef.current) return
    if (!selectedSession?.id) return
    socketRef.current.emit('join-session', selectedSession.id)
  }, [socketConnected, selectedSession])

  // Initialize app and socket
  useEffect(() => {
    console.log('[Chat] useEffect triggered')
    let mounted = true
    let hasRedirected = false
    
    const initializeApp = async () => {
      try {
        console.log('[Chat] Starting initialization...')
        if (!mounted) return
        
        setLoading(true)
        setError(null)
        console.log('[Chat] Loading set to true')
        
        const authRes = await fetch('/api/auth/me')
        console.log('[Chat] Auth check response:', authRes.status)
        
        if (!authRes.ok) {
          console.log('[Chat] Not authenticated')
          if (mounted && !hasRedirected) {
            hasRedirected = true
            setLoading(false)
            console.log('[Chat] Redirecting to login...')
            window.location.replace('/login')
          }
          return
        }

        console.log('[Chat] Authenticated - fetching data...')
        await Promise.all([fetchUsers(), fetchSessions(), fetchCurrentUser()])
        console.log('[Chat] Fetch complete - sessions should be set now')
        
        if (!mounted) return

        console.log('[Chat] Initializing socket...')
        const socketTokenRes = await fetch('/api/auth/socket-token')
        if (!socketTokenRes.ok) {
          throw new Error('Failed to fetch socket token')
        }
        const socketTokenData = await socketTokenRes.json().catch(() => ({}))
        const socketToken = socketTokenData?.token
        if (!socketToken || typeof socketToken !== 'string') {
          throw new Error('Missing socket token')
        }

        const socket = getSocket(socketToken)
        socket.connect()
        socketRef.current = socket

        socket.on('connect', () => {
          if (mounted) setSocketConnected(true)
        })

        socket.on('disconnect', () => {
          if (mounted) setSocketConnected(false)
        })

        socket.on('connect_error', (err: Error) => {
          if (mounted) {
          setSocketConnected(false)
          setError('Connection lost. Reconnecting...')
          console.error('[Socket] connect_error:', err?.message)
          }
        })

        socket.on('user-online', ({ userId }: { userId: string }) => {
          if (mounted) setOnlineUsers(prev => new Set(prev).add(userId))
        })

        socket.on('presence-state', ({ onlineUserIds }: { onlineUserIds: string[] }) => {
          if (mounted) setOnlineUsers(new Set(onlineUserIds))
        })

        socket.on('user-offline', ({ userId }: { userId: string }) => {
          if (mounted) {
          setOnlineUsers(prev => {
            const newSet = new Set(prev)
            newSet.delete(userId)
            return newSet
          })
          }
        })

        socket.on('receive-message', (message: Message) => {
          if (mounted) {
            setMessages(prev => {
              const withoutTemp = prev.filter(m => m.tempId !== message.tempId)
              return [...withoutTemp, message]
            })

            setSessions(prev => {
              const idx = prev.findIndex(s => s.id === message.sessionId)
              if (idx === -1) return prev

              const session = prev[idx]
              const isSelected = selectedSessionIdRef.current === message.sessionId
              const me = currentUserIdRef.current
              const isIncoming = me ? message.senderId !== me : true

              const updated: Session = {
                ...session,
                lastMessage: message.content,
                timestamp: message.createdAt,
                unreadCount:
                  isSelected ? 0 : isIncoming ? (session.unreadCount || 0) + 1 : session.unreadCount,
              }

              // Move the updated session to the top (matches common chat UX)
              return [updated, ...prev.filter((s) => s.id !== message.sessionId)]
            })
          }
        })

        console.log('[Chat] Setting loading to false')
        if (mounted) setLoading(false)
        console.log('[Chat] Initialization complete!')
      } catch (err) {
        console.error('[Chat] Init error:', err)
        if (mounted) {
          setError('Failed to initialize')
        setLoading(false)
        }
      }
    }

    initializeApp()

    return () => {
      mounted = false
      if (socketRef.current) {
      disconnectSocket()
      }
    }
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false)
      }
      if (newMessageDropdownRef.current && !newMessageDropdownRef.current.contains(event.target as Node) && 
          newMessageButtonRef.current && !newMessageButtonRef.current.contains(event.target as Node)) {
        setShowNewMessage(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // API Functions
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setCurrentUserId(data.user.id)
      }
    } catch (err) {
      console.error('Failed to fetch current user:', err)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')

      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      } else {
        setUsers([])
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setUsers([])
    }
  }

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/chat/sessions')

      if (!res.ok) {
        setSessions([])
        return
      }

      const data = await res.json()
      const realSessions: Session[] = data.sessions || []
      setSessions(realSessions)

      // Auto-select first session if none selected
      if (!selectedSession && !selectedUser && realSessions.length > 0) {
        const firstSession = realSessions[0]
        setSelectedSession(firstSession)
        await loadMessages(firstSession.id)
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
      setSessions([])
    }
  }

  // IMPORTANT: selecting a user should NOT create a DB session.
  // Session is created only when the first message is sent.
  const selectUserToChat = (targetUserId: string) => {
    const targetUser = users.find(u => u.id === targetUserId)
    if (!targetUser) {
      setError('User not found')
      return
    }
    setSelectedSession(null)
    setSelectedUser(targetUser)
    setMessages([])
    setShowNewMessage(false)
  }

  const loadMessages = async (sessionId: string) => {
    try {
      setLoadingMessages(true)
      const res = await fetch(`/api/chat/messages?sessionId=${sessionId}`)
      
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error('Failed to load messages:', err)
    } finally {
      setLoadingMessages(false)
    }
  }

  const ensureSessionForSelectedUser = async (): Promise<Session> => {
    if (selectedSession) return selectedSession
    if (!selectedUser) throw new Error('No recipient selected')

    const res = await fetch('/api/chat/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: selectedUser.id }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.sessionId) {
      throw new Error(data?.error || 'Failed to start chat')
    }

    const created: Session = {
      id: data.sessionId,
      otherUser: selectedUser,
      unreadCount: 0,
    }

    setSelectedSession(created)
    setSelectedUser(null)

    // Add session to list if it isn't already there (first message in a new chat)
    setSessions((prev) => {
      const exists = prev.some((s) => s.id === created.id)
      return exists ? prev : [created, ...prev]
    })

    if (socketRef.current) {
      socketRef.current.emit('join-session', created.id)
    }

    return created
  }

  const sendMessage = async () => {
    if (!messageInput.trim()) return
    if (!selectedSession && !selectedUser) return

    const tempId = `temp-${Date.now()}`
    let sessionToUse: Session
    try {
      sessionToUse = await ensureSessionForSelectedUser()
    } catch (err: any) {
      setError(err?.message || 'Failed to start chat')
      return
    }

    const tempMessage: Message = {
      id: tempId,
      content: messageInput,
      senderId: currentUserId || 'current-user',
      sessionId: sessionToUse.id,
      createdAt: new Date().toISOString(),
      sender: { id: currentUserId || 'current-user', name: 'You', email: '' },
      tempId,
    }

    setMessages(prev => [...prev, tempMessage])
    setMessageInput('')

    // Optimistically update the session row
    setSessions(prev => {
      const idx = prev.findIndex(s => s.id === sessionToUse.id)
      const session = idx === -1 ? sessionToUse : prev[idx]
      const updated: Session = {
        ...session,
        lastMessage: tempMessage.content,
        timestamp: tempMessage.createdAt,
        unreadCount: 0,
      }
      return [updated, ...prev.filter(s => s.id !== sessionToUse.id)]
    })

    const isAiChat = sessionToUse.otherUser.email === 'ai@chat.app'

    if (isAiChat) {
      const aiUserId = sessionToUse.otherUser.id
      const typingId = `typing-${Date.now()}`

      setAiTyping(true)
      setMessages((prev) => [
        ...prev,
        {
          id: typingId,
          content: 'Typing…',
          senderId: aiUserId,
          sessionId: sessionToUse.id,
          createdAt: new Date().toISOString(),
          sender: {
            id: aiUserId,
            name: sessionToUse.otherUser.name,
            email: sessionToUse.otherUser.email,
          },
        },
      ])

      fetch('/api/ai/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionToUse.id, message: tempMessage.content }),
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}))
          if (!res.ok) throw new Error(data?.error || 'AI request failed')

          setMessages((prev) => {
            const withoutTemp = prev
              .filter((m) => m.tempId !== tempId)
              .filter((m) => m.id !== typingId)
            return [...withoutTemp, data.userMessage, data.assistantMessage]
          })

          setSessions((prev) => {
            const idx = prev.findIndex((s) => s.id === sessionToUse.id)
            if (idx === -1) return prev
            const session = prev[idx]
            const updated: Session = {
              ...session,
              lastMessage: data.assistantMessage?.content || session.lastMessage,
              timestamp: data.assistantMessage?.createdAt || session.timestamp,
              unreadCount: 0,
            }
            return [updated, ...prev.filter((s) => s.id !== sessionToUse.id)]
          })
        })
        .catch((err) => {
          console.error(err)
          setError(err?.message || 'AI reply failed')
          setMessages((prev) => prev.filter((m) => m.id !== typingId))
        })
        .finally(() => {
          setAiTyping(false)
        })

      return
    }

    if (socketRef.current) {
      socketRef.current.emit('send-message', {
        sessionId: sessionToUse.id,
        content: tempMessage.content,
        tempId,
      })
    }
  }

  const handleSelectSession = (session: Session) => {
    setSelectedSession(session)
    setSelectedUser(null)
    loadMessages(session.id)
    setSwipedSession(null)
    
    // Clear unread count when opening a session
    if (session.unreadCount && session.unreadCount > 0) {
      setSessions(prev => prev.map(s => 
        s.id === session.id ? { ...s, unreadCount: 0 } : s
      ))
    }
    
    if (socketRef.current) {
      socketRef.current.emit('join-session', session.id)
    }
  }

  const handleContextMenu = (e: React.MouseEvent, session: Session) => {
    e.preventDefault()
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setShowContextMenu(true)
    setSelectedSession(session)
  }

  const handleTouchStart = (e: React.TouchEvent, sessionId: string) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsDragging(false)
    // Clear other swiped sessions
    if (swipedSession && !swipedSession.startsWith(sessionId)) {
      setSwipedSession(null)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchEnd = (sessionId: string) => {
    if (!isDragging || !touchStart || !touchEnd) {
      setTouchStart(null)
      setTouchEnd(null)
      setIsDragging(false)
      return
    }
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setSwipedSession(`${sessionId}-left`)
    } else if (isRightSwipe) {
      setSwipedSession(`${sessionId}-right`)
    } else {
      setSwipedSession(null)
    }
    
    setTouchStart(null)
    setTouchEnd(null)
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent, sessionId: string) => {
    setTouchEnd(null)
    setTouchStart(e.clientX)
    setIsDragging(false)
    // Clear other swiped sessions
    if (swipedSession && !swipedSession.startsWith(sessionId)) {
      setSwipedSession(null)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart !== null) {
      setTouchEnd(e.clientX)
      setIsDragging(true)
    }
  }

  const handleMouseUp = (sessionId: string) => {
    if (!isDragging || !touchStart || !touchEnd) {
      setTouchStart(null)
      setTouchEnd(null)
      setIsDragging(false)
      return
    }
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setSwipedSession(`${sessionId}-left`)
    } else if (isRightSwipe) {
      setSwipedSession(`${sessionId}-right`)
    } else {
      setSwipedSession(null)
    }
    
    setTouchStart(null)
    setTouchEnd(null)
    setIsDragging(false)
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const formatTimestamp = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (minutes < 60) return `${minutes} mins ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return d.toLocaleDateString()
  }

  console.log('[Chat Render] Loading state:', loading, 'Sessions:', sessions.length)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-screen bg-[#F5F3F0]">
        <ChatSidebar />
      
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          <TopNavBar />

          <div className="flex-1 flex gap-4 mt-4 overflow-hidden">
            {/* Conversations List Card */}
            <div className="w-[360px] bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col shrink-0">
              <ConversationsList
                sessions={sessions}
                users={users}
                selectedSession={selectedSession}
                showNewMessage={showNewMessage}
                onlineUsers={onlineUsers}
                swipedSession={swipedSession}
                newMessageButtonRef={newMessageButtonRef}
                newMessageDropdownRef={newMessageDropdownRef}
                onToggleNewMessage={() => setShowNewMessage(!showNewMessage)}
                onSelectSession={handleSelectSession}
                onStartChat={selectUserToChat}
                onContextMenu={handleContextMenu}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                formatTimestamp={formatTimestamp}
              />
            </div>

            {/* Chat Content Card */}
            <div className="flex-1 bg-[#fff] rounded-2xl shadow-sm overflow-hidden flex flex-col p-4">
              {selectedSession || selectedUser ? (
                <div className="flex-1 bg-white rounded-2xl overflow-hidden flex flex-col">
                  <ChatHeader
                    user={(selectedSession?.otherUser || selectedUser)!}
                    isOnline={onlineUsers.has((selectedSession?.otherUser || selectedUser)!.id)}
                    onToggleContactInfo={() => setShowContactInfo(!showContactInfo)}
                  />

                  <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 bg-[#F5F3F0] rounded-md">
                    <ChatMessages
                      messages={messages}
                      currentUserId={currentUserId}
                      loadingMessages={loadingMessages}
                      messagesEndRef={messagesEndRef}
                      formatTime={formatTime}
                    />
                  </div>

                  <MessageInput
                    messageInput={messageInput}
                    onMessageChange={setMessageInput}
                    onSendMessage={sendMessage}
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showContactInfo && (selectedSession || selectedUser) && (
        <ContactInfoModal
          user={(selectedSession?.otherUser || selectedUser)!}
          isOnline={onlineUsers.has((selectedSession?.otherUser || selectedUser)!.id)}
          onClose={() => setShowContactInfo(false)}
        />
      )}

      {showContextMenu && (
        <ContextMenu
          position={contextMenuPosition}
          menuRef={contextMenuRef}
          onContactInfo={() => {
            setShowContactInfo(true)
            setShowContextMenu(false)
          }}
        />
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border-l-4 border-red-500 px-4 py-3 rounded shadow-lg z-50 flex items-center justify-between max-w-md">
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-4 text-red-700 hover:text-red-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  )
}

