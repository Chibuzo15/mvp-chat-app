import { Phone, Video, MoreVertical } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
}

interface ChatHeaderProps {
  user: User
  isOnline: boolean
  onToggleContactInfo: () => void
}

export function ChatHeader({ user, isOnline, onToggleContactInfo }: ChatHeaderProps) {
  return (
    <div className="bg-white px-6 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white rounded-full ${
              isOnline ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
            aria-label={isOnline ? 'Online' : 'Offline'}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{user.name}</h3>
          <p className="text-xs text-emerald-500">
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
          <Phone className="w-5 h-5 text-gray-700" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
          <Video className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={onToggleContactInfo}
          className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  )
}

