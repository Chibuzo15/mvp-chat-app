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
  otherLastReadAt?: string
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
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [aiTyping, setAiTyping] = useState(false)
  const [typingBySession, setTypingBySession] = useState<Record<string, Record<string, boolean>>>({})
  const [swipedSession, setSwipedSession] = useState<string | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [readUpToBySession, setReadUpToBySession] = useState<Record<string, string>>({})
  
  const socketRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const newMessageButtonRef = useRef<HTMLButtonElement>(null)
  const newMessageDropdownRef = useRef<HTMLDivElement>(null)
  const selectedSessionIdRef = useRef<string | null>(null)
  const currentUserIdRef = useRef<string | null>(null)
  const loadMessagesRequestIdRef = useRef(0)
  const typingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTypingRef = useRef<{ sessionId: string | null; isTyping: boolean }>({
    sessionId: null,
    isTyping: false,
  })

  useEffect(() => {
    selectedSessionIdRef.current = selectedSession?.id ?? null
  }, [selectedSession])

  useEffect(() => {
    currentUserIdRef.current = currentUserId
  }, [currentUserId])

  // Re-filter users when currentUser changes to ensure self is never shown
  useEffect(() => {
    if (currentUser?.id) {
      setUsers(prev => prev.filter(u => u.id !== currentUser.id))
    }
  }, [currentUser?.id])

  // Ensure we join the currently selected room once the socket is connected
  useEffect(() => {
    if (!socketConnected) return
    if (!socketRef.current) return
    if (!selectedSession?.id) return
    socketRef.current.emit('join-session', selectedSession.id)
    // Mark as read whenever the user is actively viewing this session (covers initial auto-select too).
    socketRef.current.emit('mark-read', { sessionId: selectedSession.id })
  }, [socketConnected, selectedSession])

  // Initialize app and socket
  /* eslint-disable react-hooks/exhaustive-deps */
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
            // Only append to the open thread. We still update the conversation list/unread count below.
            if (selectedSessionIdRef.current === message.sessionId) {
              setMessages(prev => {
                const withoutTemp = prev.filter(m => m.tempId !== message.tempId)
                return [...withoutTemp, message]
              })

              // If this is an incoming message in the currently open session, mark it read immediately
              // so the sender can see read-receipts without refresh.
              const me = currentUserIdRef.current
              const isIncoming = me ? message.senderId !== me : true
              if (isIncoming && socketRef.current) {
                socketRef.current.emit('mark-read', { sessionId: message.sessionId })
              }
            }

            // Clear typing state for the sender in this session.
            setTypingBySession((prev) => {
              const sessionTyping = prev[message.sessionId]
              if (!sessionTyping || !sessionTyping[message.senderId]) return prev
              const nextSessionTyping = { ...sessionTyping, [message.senderId]: false }
              return { ...prev, [message.sessionId]: nextSessionTyping }
            })

            setSessions(prev => {
              const idx = prev.findIndex(s => s.id === message.sessionId)
              
              // If session doesn't exist, we need to fetch it or create a placeholder
              // This can happen if the user receives a message before their sessions list is refreshed/loaded
              if (idx === -1) {
                // Create a placeholder session from the message data
                // This ensures we don't lose the message in the UI.
                const placeholderSession: Session = {
                  id: message.sessionId,
                  otherUser: message.sender,
                  lastMessage: message.content,
                  timestamp: message.createdAt,
                  unreadCount: selectedSessionIdRef.current === message.sessionId ? 0 : 1,
                }
                // Add to top (most recent message), sorted by timestamp - no special AI pinning
                return [placeholderSession, ...prev]
              }

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

        // Read-state sync:
        // - If I read: clear unread across my tabs
        // - If other user read: update tick marks for my outgoing messages (selected session)
        socket.on(
          'session-read',
          ({ sessionId, readerId, readAt }: { sessionId: string; readerId?: string; readAt?: string }) => {
            if (!mounted) return
            if (!sessionId) return

            const me = currentUserIdRef.current
            if (me && readerId === me) {
              setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, unreadCount: 0 } : s)))
              return
            }

            if (readAt) {
              setReadUpToBySession((prev) => ({ ...prev, [sessionId]: readAt }))
            }
          }
        )

        socket.on(
          'user-typing',
          ({ sessionId, userId, isTyping }: { sessionId: string; userId: string; isTyping: boolean }) => {
            if (!mounted) return
            setTypingBySession((prev) => ({
              ...prev,
              [sessionId]: {
                ...(prev[sessionId] || {}),
                [userId]: !!isTyping,
              },
            }))
          }
        )

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
  /* eslint-enable react-hooks/exhaustive-deps */

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
        setCurrentUser(data.user)
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
        // Safeguard: never show yourself in the "New Message" list even if the API regresses.
        const list: User[] = data.users || []
        // Filter out current user using both ref and state for robustness
        const currentId = currentUserIdRef.current || currentUserId || currentUser?.id
        const filtered = currentId
          ? list.filter((u) => u.id !== currentId)
          : list
        setUsers(filtered)
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

      // Seed read receipts state so additionally-opened tabs show correct ticks without needing a new event.
      setReadUpToBySession((prev) => {
        const next = { ...prev }
        for (const s of realSessions) {
          if (s?.id && s?.otherLastReadAt) next[s.id] = s.otherLastReadAt
        }
        return next
      })

      // Auto-select first session if none selected (only on desktop, md+ breakpoint = 768px)
      // On mobile, default to showing the conversations list
      if (!selectedSession && !selectedUser && realSessions.length > 0) {
        const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768
        if (isDesktop) {
          const firstSession = realSessions[0]
          setSelectedSession(firstSession)
          selectedSessionIdRef.current = firstSession.id
          await loadMessages(firstSession.id)
        }
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
      setSessions([])
    }
  }

  // Competition spec expects "clicking on a user starts a chat session".
  // We create/select the DB session immediately on click.
  const selectUserToChat = async (targetUserId: string) => {
    const targetUser = users.find(u => u.id === targetUserId)
    if (!targetUser) {
      setError('User not found')
      return
    }
    try {
      setShowNewMessage(false)
      setSelectedUser(null)
    setSelectedSession(null)
      setMessages([])
      setMessageInput('')
      setAiTyping(false)

      const res = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: targetUser.id }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.sessionId) {
        throw new Error(data?.error || 'Failed to start chat')
      }

      const created: Session = {
        id: data.sessionId,
        otherUser: targetUser,
        unreadCount: 0,
      }

      setSelectedSession(created)
      selectedSessionIdRef.current = created.id

      // Add session to list if it isn't already there
      setSessions((prev) => {
        const exists = prev.some((s) => s.id === created.id)
        return exists ? prev : [created, ...prev]
      })

      if (socketRef.current) {
        socketRef.current.emit('join-session', created.id)
      }

      await loadMessages(created.id)
    } catch (err: any) {
      setError(err?.message || 'Failed to start chat')
      // Keep the target as a draft selection so the user can retry by sending a message.
    setSelectedUser(targetUser)
    }
  }

  const loadMessages = async (sessionId: string) => {
    try {
      const requestId = ++loadMessagesRequestIdRef.current
      setLoadingMessages(true)
      setMessages([])
      const res = await fetch(`/api/chat/messages?sessionId=${sessionId}`)
      
      if (res.ok) {
        const data = await res.json()
        // Prevent stale loads from overwriting a newly selected conversation.
        if (requestId !== loadMessagesRequestIdRef.current) return
        if (selectedSessionIdRef.current !== sessionId) return
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
    selectedSessionIdRef.current = created.id
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

    // Stop typing indicator immediately when sending.
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current)
    if (socketRef.current && sessionToUse.otherUser.email !== 'ai@chat.app') {
      socketRef.current.emit('typing', { sessionId: sessionToUse.id, isTyping: false })
      lastTypingRef.current = { sessionId: sessionToUse.id, isTyping: false }
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
    // Leave previous room to prevent duplicate typing events over time.
    const prevSessionId = selectedSessionIdRef.current
    if (socketRef.current && prevSessionId && prevSessionId !== session.id) {
      socketRef.current.emit('leave-session', prevSessionId)
    }

    setSelectedSession(session)
    selectedSessionIdRef.current = session.id
    setSelectedUser(null)
    setMessageInput('')
    setAiTyping(false)
    loadMessages(session.id)
    setSwipedSession(null)
    
    // Clear unread count when opening a session
    setSessions((prev) => prev.map((s) => (s.id === session.id ? { ...s, unreadCount: 0 } : s)))
    
    if (socketRef.current) {
      socketRef.current.emit('join-session', session.id)
      socketRef.current.emit('mark-read', { sessionId: session.id })
    }

    if (session.otherLastReadAt) {
      setReadUpToBySession((prev) => ({ ...prev, [session.id]: session.otherLastReadAt as string }))
    }
  }

  // Emit typing events (debounced) for realtime "typing…" indicators.
  useEffect(() => {
    const sessionId = selectedSession?.id || null
    const otherEmail = selectedSession?.otherUser?.email
    const isAiChat = otherEmail === 'ai@chat.app'

    // Only emit typing for established (DB) human chats.
    if (!socketRef.current || !socketConnected || !sessionId || isAiChat) {
      // If we were previously typing in another session, stop it.
      if (lastTypingRef.current.sessionId && lastTypingRef.current.isTyping && socketRef.current) {
        socketRef.current.emit('typing', { sessionId: lastTypingRef.current.sessionId, isTyping: false })
      }
      lastTypingRef.current = { sessionId: null, isTyping: false }
      return
    }

    const isTypingNow = !!messageInput.trim()

    // Start typing immediately on first keystroke.
    if (isTypingNow && (!lastTypingRef.current.isTyping || lastTypingRef.current.sessionId !== sessionId)) {
      socketRef.current.emit('typing', { sessionId, isTyping: true })
      lastTypingRef.current = { sessionId, isTyping: true }
    }

    // Debounce stop-typing.
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current)
    typingStopTimerRef.current = setTimeout(() => {
      if (!socketRef.current) return
      if (lastTypingRef.current.sessionId !== sessionId) return
      socketRef.current.emit('typing', { sessionId, isTyping: false })
      lastTypingRef.current = { sessionId, isTyping: false }
    }, 1200)

    return () => {
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current)
    }
  }, [messageInput, selectedSession?.id, selectedSession?.otherUser?.email, socketConnected])

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

  // Filter sessions based on search query
  const filteredSessions = searchQuery.trim()
    ? sessions.filter(session => {
        const query = searchQuery.toLowerCase()
        const userName = session.otherUser.name.toLowerCase()
        const userEmail = session.otherUser.email.toLowerCase()
        const lastMessage = (session.lastMessage || '').toLowerCase()
        return userName.includes(query) || userEmail.includes(query) || lastMessage.includes(query)
      })
    : sessions

  const hasActiveChat = !!(selectedSession || selectedUser)

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
      <div className="flex min-h-screen h-[100dvh] bg-[#F5F3F0]">
        <ChatSidebar />
      
        <div className="flex-1 flex flex-col overflow-hidden p-2 sm:p-4">
          <TopNavBar currentUser={currentUser} />

          <div className="flex-1 flex gap-4 mt-4 overflow-hidden">
            {/* Conversations List Card */}
            <div
              className={[
                'bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col',
                'w-full md:w-[360px] shrink-0',
                hasActiveChat ? 'hidden md:flex' : 'flex',
              ].join(' ')}
            >
              <ConversationsList
                sessions={filteredSessions}
                users={users}
                selectedSession={selectedSession}
                showNewMessage={showNewMessage}
                onlineUsers={onlineUsers}
                typingBySession={typingBySession}
                swipedSession={swipedSession}
                newMessageButtonRef={newMessageButtonRef}
                newMessageDropdownRef={newMessageDropdownRef}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
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
            <div
              className={[
                'flex-1 bg-[#fff] rounded-2xl shadow-sm overflow-hidden flex flex-col p-3 sm:p-4',
                hasActiveChat ? 'flex' : 'hidden md:flex',
              ].join(' ')}
            >
              {selectedSession || selectedUser ? (
                <div className="flex-1 bg-white rounded-2xl overflow-hidden flex flex-col">
                  <ChatHeader
                    user={(selectedSession?.otherUser || selectedUser)!}
                    isOnline={
                      (selectedSession?.otherUser || selectedUser)!.email === 'ai@chat.app'
                        ? true
                        : onlineUsers.has((selectedSession?.otherUser || selectedUser)!.id)
                    }
                    isTyping={
                      (selectedSession?.otherUser?.email === 'ai@chat.app' ? aiTyping : false) ||
                      (selectedSession?.id
                        ? !!typingBySession[selectedSession.id]?.[(selectedSession?.otherUser || selectedUser)!.id]
                        : false)
                    }
                    onToggleContactInfo={() => setShowContactInfo(!showContactInfo)}
                    onBack={() => {
                      // Leaving the room prevents stale typing events if the user re-enters later.
                      if (socketRef.current && selectedSessionIdRef.current) {
                        socketRef.current.emit('leave-session', selectedSessionIdRef.current)
                      }
                      setSelectedSession(null)
                      selectedSessionIdRef.current = null
                      setSelectedUser(null)
                      setMessages([])
                      setMessageInput('')
                      setAiTyping(false)
                    }}
                  />

                  <div className="flex-1 overflow-y-auto px-3 sm:px-8 py-4 sm:py-6 space-y-4 bg-[#F5F3F0] rounded-md">
                    <ChatMessages
                      messages={messages}
                      currentUserId={currentUserId}
                      readUpTo={selectedSession?.id ? readUpToBySession[selectedSession.id] : undefined}
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

