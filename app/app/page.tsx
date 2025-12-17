'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getSocket, disconnectSocket } from '@/lib/socket-client'
import { 
  Home, MessageSquare, Pin, Folder, Image as ImageIcon, 
  Search, Phone, Video, MoreVertical, Send, Mic, Smile, 
  Paperclip, Check, CheckCheck, Filter, Plus, X, Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
  unread?: boolean
}

export default function ChatPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [contactTab, setContactTab] = useState<'media' | 'link' | 'docs'>('media')
  const [searchQuery, setSearchQuery] = useState('')
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const socketRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchUsers()
    fetchSessions()
    
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1]

    if (token) {
      const socket = getSocket()
      socket.auth = { token }
      socket.connect()
      socketRef.current = socket

      socket.on('user-online', ({ userId }: { userId: string }) => {
        setOnlineUsers(prev => new Set(prev).add(userId))
      })

      socket.on('user-offline', ({ userId }: { userId: string }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(userId)
          return newSet
        })
      })

      socket.on('receive-message', (message: Message) => {
        setMessages(prev => {
          const filtered = prev.filter(m => m.tempId !== message.tempId)
          return [...filtered, message]
        })
      })
    }

    return () => {
      disconnectSocket()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchUsers = async () => {
    const res = await fetch('/api/users')
    if (res.ok) {
      const data = await res.json()
      setUsers(data.users)
    }
  }

  const fetchSessions = async () => {
    // TODO: Implement GET /api/chat/sessions endpoint
    // For now, we'll populate this when starting new chats
  }

  const startChat = async (targetUserId: string) => {
    const res = await fetch('/api/chat/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId }),
    })

    if (res.ok) {
      const { sessionId } = await res.json()
      const user = users.find(u => u.id === targetUserId)!
      const session: Session = { id: sessionId, otherUser: user }
      
      setSelectedSession(session)
      setShowNewMessage(false)
      loadMessages(sessionId)
      
      if (socketRef.current) {
        socketRef.current.emit('join-session', sessionId)
      }
    }
  }

  const loadMessages = async (sessionId: string) => {
    const res = await fetch(`/api/chat/messages?sessionId=${sessionId}`)
    if (res.ok) {
      const { messages } = await res.json()
      setMessages(messages)
    }
  }

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedSession) return

    const tempId = `temp-${Date.now()}`
    const tempMessage: Message = {
      id: tempId,
      content: messageInput,
      senderId: 'current-user', // Will be set by server
      sessionId: selectedSession.id,
      createdAt: new Date().toISOString(),
      sender: { id: 'current-user', name: 'You', email: '' },
      tempId,
    }

    setMessages(prev => [...prev, tempMessage])
    setMessageInput('')

    if (socketRef.current) {
      socketRef.current.emit('send-message', {
        sessionId: selectedSession.id,
        content: tempMessage.content,
        tempId,
      })
    }
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

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Left Sidebar */}
      <div className="w-20 bg-slate-800 flex flex-col items-center py-6 space-y-6">
        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        
        <nav className="flex-1 flex flex-col space-y-6">
          <button className="w-12 h-12 flex items-center justify-center text-white hover:bg-slate-700 rounded-lg">
            <Home className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center text-emerald-500 bg-slate-700 rounded-lg">
            <MessageSquare className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-slate-700 rounded-lg">
            <Pin className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-slate-700 rounded-lg">
            <Folder className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-slate-700 rounded-lg">
            <ImageIcon className="w-6 h-6" />
          </button>
        </nav>

        <button className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Conversations Panel */}
      <div className="w-96 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">All Message</h2>
            <Button
              onClick={() => setShowNewMessage(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Message
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search in message"
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {users.map(user => (
            <div
              key={user.id}
              onClick={() => startChat(user.id)}
              className="flex items-center gap-3 p-4 hover:bg-slate-50 cursor-pointer border-b"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-slate-300 rounded-full" />
                {onlineUsers.has(user.id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <span className="text-xs text-slate-400">3 mins ago</span>
                </div>
                <p className="text-sm text-slate-500 truncate">Click to start chat</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {selectedSession ? (
          <>
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-slate-300 rounded-full" />
                  {onlineUsers.has(selectedSession.otherUser.id) && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedSession.otherUser.name}</h3>
                  <p className="text-xs text-emerald-500">
                    {onlineUsers.has(selectedSession.otherUser.id) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Search className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowContactInfo(!showContactInfo)}
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex justify-center">
                <span className="text-xs text-slate-400 bg-white px-3 py-1 rounded-full">
                  Today
                </span>
              </div>

              {messages.map((message, idx) => {
                const isOwn = message.sender.id === 'current-user'
                const showTime = idx === 0 || 
                  new Date(messages[idx - 1].createdAt).getTime() - new Date(message.createdAt).getTime() > 300000

                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md ${isOwn ? 'bg-white' : 'bg-emerald-500 text-white'} rounded-lg p-3 shadow-sm`}>
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                        <span className={`text-xs ${isOwn ? 'text-slate-400' : 'text-emerald-100'}`}>
                          {formatTime(message.createdAt)}
                        </span>
                        {isOwn && (
                          <CheckCheck className={`w-4 h-4 ${message.tempId ? 'text-slate-300' : 'text-emerald-500'}`} />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Mic className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Smile className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="Type any message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  size="icon"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Contact Info Sidebar */}
      {showContactInfo && selectedSession && (
        <div className="w-96 bg-white border-l flex flex-col">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-semibold">Contact Info</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowContactInfo(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 border-b text-center">
            <div className="w-20 h-20 bg-slate-300 rounded-full mx-auto mb-3" />
            <h4 className="font-semibold">{selectedSession.otherUser.name}</h4>
            <p className="text-sm text-slate-500">{selectedSession.otherUser.email}</p>
            
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Audio
              </Button>
              <Button variant="outline" className="flex-1">
                <Video className="w-4 h-4 mr-2" />
                Video
              </Button>
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setContactTab('media')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                  contactTab === 'media'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Media
              </button>
              <button
                onClick={() => setContactTab('link')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                  contactTab === 'link'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Link
              </button>
              <button
                onClick={() => setContactTab('docs')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                  contactTab === 'docs'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Docs
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {contactTab === 'media' && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">May</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="aspect-square bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {contactTab === 'link' && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500 mb-2">May</p>
                {['basecamp.net', 'notion.com', 'asana.com', 'trello.com'].map(link => (
                  <div key={link} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50">
                    <div className="w-10 h-10 bg-slate-200 rounded flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">https://{link}/</p>
                      <p className="text-xs text-slate-500 truncate">Shared link</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {contactTab === 'docs' && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500 mb-2">May</p>
                {[
                  { name: 'Document Requirement.pdf', size: '16 MB', pages: '10 pages' },
                  { name: 'User Flow.pdf', size: '32 MB', pages: '7 pages' },
                  { name: 'Existing App.fig', size: '213 MB', pages: 'fig' },
                ].map(doc => (
                  <div key={doc.name} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50">
                    <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-red-600">PDF</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.pages} • {doc.size} • pdf</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">New Message</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNewMessage(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search name or email" className="pl-10" />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {users.map(user => (
                <div
                  key={user.id}
                  onClick={() => startChat(user.id)}
                  className="flex items-center gap-3 p-4 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="w-10 h-10 bg-slate-300 rounded-full" />
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

