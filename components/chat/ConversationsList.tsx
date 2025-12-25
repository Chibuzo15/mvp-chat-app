'use client'

import { CheckCheck, X } from 'lucide-react'
import { PenIcon, SearchIcon, FilterIcon, MessageMenuIcon, ArchiveIcon } from '@/components/icons'
import { RefObject } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface Session {
  id: string
  otherUser: User
  lastMessage?: string
  timestamp?: string
  unreadCount?: number
}

interface ConversationsListProps {
  sessions: Session[]
  users: User[]
  selectedSession: Session | null
  showNewMessage: boolean
  onlineUsers: Set<string>
  typingBySession?: Record<string, Record<string, boolean>>
  swipedSession: string | null
  newMessageButtonRef: RefObject<HTMLButtonElement>
  newMessageDropdownRef: RefObject<HTMLDivElement>
  searchQuery: string
  onSearchChange: (query: string) => void
  onToggleNewMessage: () => void
  onSelectSession: (session: Session) => void
  onStartChat: (userId: string) => void
  onContextMenu: (e: React.MouseEvent, session: Session) => void
  onTouchStart: (e: React.TouchEvent, sessionId: string) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: (sessionId: string) => void
  onMouseDown: (e: React.MouseEvent, sessionId: string) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: (sessionId: string) => void
  formatTimestamp: (date: string) => string
}

export function ConversationsList({
  sessions,
  users,
  selectedSession,
  showNewMessage,
  onlineUsers,
  typingBySession,
  swipedSession,
  newMessageButtonRef,
  newMessageDropdownRef,
  searchQuery,
  onSearchChange,
  onToggleNewMessage,
  onSelectSession,
  onStartChat,
  onContextMenu,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  formatTimestamp,
}: ConversationsListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">All Message</h2>
          <div className="relative">
            <button
              ref={newMessageButtonRef}
              onClick={onToggleNewMessage}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#2D9B98] hover:bg-[#268784] text-white text-sm font-medium rounded-lg transition-colors"
            >
              <PenIcon className="w-4 h-4" />
              New Message
            </button>
            
            {/* New Message Dropdown */}
            {showNewMessage && (
              <div
                ref={newMessageDropdownRef}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">New Message</h3>
                </div>
                
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search name or email"
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {users.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">
                      <MessageMenuIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs">No users available</p>
                    </div>
                  ) : (
                    users.map(user => (
                      <div
                        key={user.id}
                        onClick={() => onStartChat(user.id)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="relative shrink-0">
                          <div className="w-9 h-9 bg-gray-300 rounded-full overflow-hidden">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div
                            className={`absolute -top-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${
                              onlineUsers.has(user.id) ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                            aria-label={onlineUsers.has(user.id) ? 'Online' : 'Offline'}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-6 py-3">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#262626]" />
            <input
              type="text"
              placeholder="Search in message"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors placeholder:text-[#262626] text-[#262626]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4 text-gray-600" strokeWidth={2} />
              </button>
            )}
          </div>
          {!searchQuery && (
          <button className="w-9 h-9 flex items-center justify-center border border-[#E8E5DF] bg-white rounded-lg hover:bg-gray-50 transition-colors">
            <FilterIcon className="w-4 h-4 text-[#262626]" />
          </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 px-6">
        {sessions.length === 0 && users.length > 0 && (
          <div className="py-6 text-center text-gray-500">
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new message to begin chatting</p>
          </div>
        )}
        
        {sessions.map(session => (
          <div
            key={session.id}
            className="relative overflow-hidden select-none mb-2"
            onTouchStart={(e) => onTouchStart(e, session.id)}
            onTouchMove={onTouchMove}
            onTouchEnd={() => onTouchEnd(session.id)}
            onMouseDown={(e) => onMouseDown(e, session.id)}
            onMouseMove={onMouseMove}
            onMouseUp={() => onMouseUp(session.id)}
            onMouseLeave={() => onMouseUp(session.id)}
          >
            {/* Left Swipe Action (Unread) */}
            <div
              className={`absolute left-0 top-0 bottom-0 flex items-center pl-2 transition-transform duration-200 ${
                swipedSession === `${session.id}-right` ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <button className="w-[70px] h-[70px] bg-[#3BA395] text-white flex flex-col items-center justify-center gap-1 rounded-[12px]">
                <MessageMenuIcon className="w-5 h-5 text-white" />
                <span className="text-xs font-medium">Unread</span>
              </button>
            </div>

            {/* Right Swipe Action (Archive) */}
            <div
              className={`absolute right-0 top-0 bottom-0 flex items-center justify-end pr-2 transition-transform duration-200 ${
                swipedSession === `${session.id}-left` ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <button className="w-[70px] h-[70px] bg-[#3BA395] text-white flex flex-col items-center justify-center gap-1 rounded-[12px]">
                <ArchiveIcon className="w-5 h-5 text-white" />
                <span className="text-xs font-medium">Archive</span>
              </button>
            </div>

            {/* Contact Item */}
            <div
              onClick={(e) => {
                // Only select if not swiped
                if (!swipedSession || !swipedSession.startsWith(session.id)) {
                  onSelectSession(session)
                }
              }}
              onContextMenu={(e) => onContextMenu(e, session)}
              className={`flex items-start gap-3 h-[70px] px-4 py-4 cursor-pointer transition-all duration-200 relative ${
                selectedSession?.id === session.id || swipedSession?.startsWith(session.id) 
                  ? 'bg-gray-100 rounded-[12px]' 
                  : 'bg-white hover:bg-gray-50'
              } ${
                swipedSession === `${session.id}-left` ? '-translate-x-[85px]' : 
                swipedSession === `${session.id}-right` ? 'translate-x-[85px]' : 
                'translate-x-0'
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.otherUser.id}`}
                    alt={session.otherUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className={`absolute -top-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${
                    session.otherUser.email === 'ai@chat.app' || onlineUsers.has(session.otherUser.id)
                      ? 'bg-emerald-500'
                      : 'bg-gray-300'
                  }`}
                  aria-label={
                    session.otherUser.email === 'ai@chat.app' || onlineUsers.has(session.otherUser.id)
                      ? 'Online'
                      : 'Offline'
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm text-gray-900">{session.otherUser.name}</h3>
                  {session.timestamp && (
                    <span className="text-xs text-gray-400 ml-2">{formatTimestamp(session.timestamp)}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 truncate flex-1">
                    {typingBySession?.[session.id]?.[session.otherUser.id]
                      ? 'Typing…'
                      : session.lastMessage || 'No messages yet'}
                  </p>
                  {session.lastMessage && !session.unreadCount && (
                    <CheckCheck className="w-4 h-4 text-gray-400 ml-2 shrink-0" strokeWidth={2} />
                  )}
                </div>
              </div>
              
              {/* Unread Count Badge - Right side only, hide if 0 */}
              {session.unreadCount && session.unreadCount > 0 ? (
                <div className="ml-2 shrink-0">
                  <div className="min-w-[20px] h-5 px-1.5 bg-[#25D366] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold leading-none">{session.unreadCount}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

