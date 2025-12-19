'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          // User is authenticated, redirect to chat
          window.location.href = '/chat'
        } else {
          // User is not authenticated, redirect to login
          window.location.href = '/login'
        }
      } catch (error) {
        // Error checking auth, redirect to login
        window.location.href = '/login'
      }
    }

    checkAuth()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  )
}

