import { X, Phone, Video } from 'lucide-react'
import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface ContactInfoModalProps {
  user: User
  isOnline: boolean
  onClose: () => void
}

export function ContactInfoModal({ user, isOnline, onClose }: ContactInfoModalProps) {
  const [activeTab, setActiveTab] = useState<'media' | 'link' | 'docs'>('media')
  const [isVisible, setIsVisible] = useState(false)
  const computedOnline = user.email === 'ai@chat.app' ? true : isOnline

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`fixed top-0 right-0 bottom-0 w-full bg-white rounded-none sm:top-4 sm:right-4 sm:bottom-4 sm:w-[400px] sm:rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden transition-transform duration-300 ease-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Contact Info</h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-6 py-8 border-b border-gray-100 flex flex-col items-center shrink-0">
          <div className="relative w-24 h-24 rounded-full mb-4 overflow-hidden flex items-center justify-center bg-gray-200">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
              alt={user.name}
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute -top-0.5 -right-0.5 w-4 h-4 border-2 border-white rounded-full ${
                computedOnline ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
              aria-label={computedOnline ? 'Online' : 'Offline'}
            />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            {user.name}
          </h4>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className={`text-xs font-medium mt-1 mb-6 ${computedOnline ? 'text-emerald-600' : 'text-gray-400'}`}>
            {computedOnline ? 'Online' : 'Offline'}
          </p>
        
          {/* Audio/Video Buttons */}
          <div className="flex gap-3 w-full">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">Audio</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Video className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">Video</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100 shrink-0 bg-gray-50">
          <div className="flex gap-1 px-4 py-2">
            <button
              onClick={() => setActiveTab('media')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'media'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Media
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'link'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Link
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'docs'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Docs
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'media' && (
            <div className="p-6 space-y-6">
              {/* May */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-3">May</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="aspect-square bg-gradient-to-br from-purple-500 via-purple-400 to-pink-400 rounded-lg" />
                  <div className="aspect-square bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 rounded-lg" />
                  <div className="aspect-square bg-gradient-to-br from-blue-300 via-blue-200 to-cyan-200 rounded-lg" />
                  <div className="aspect-square bg-gradient-to-br from-red-400 via-pink-400 to-purple-500 rounded-lg" />
                  <div className="aspect-square bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-lg" />
                  <div className="aspect-square bg-gradient-to-br from-orange-300 via-yellow-300 to-orange-200 rounded-lg" />
                  <div className="aspect-square bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-lg" />
                </div>
              </div>

              {/* April */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-3">April</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="aspect-square bg-gradient-to-br from-blue-600 via-blue-500 to-red-500 rounded-lg" />
                  <div className="aspect-square bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-lg" />
                  <div className="aspect-square bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500 rounded-lg" />
                  <div className="aspect-square bg-gradient-to-br from-pink-300 via-pink-200 to-pink-300 rounded-lg" />
                </div>
              </div>

              {/* March */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-3">March</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="aspect-square bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-lg" />
                  <div className="aspect-square bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 rounded-lg" />
                  <div className="aspect-square bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 rounded-lg" />
                  <div className="aspect-square bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-lg" />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'link' && (
            <div className="p-6">
              <p className="text-xs font-medium text-gray-500 mb-3">May</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                    <div className="w-6 h-6 bg-emerald-600 rounded" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">https://basecamp.net/</p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      Discover thousands of premium UI kits, templates, and design resources tailored for designers, developers, and...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'docs' && (
            <div className="p-6">
              <p className="text-xs font-medium text-gray-500 mb-3">May</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-red-600">PDF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Document Requirement.pdf</p>
                    <p className="text-xs text-gray-500">10 pages • 16 MB • pdf</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

