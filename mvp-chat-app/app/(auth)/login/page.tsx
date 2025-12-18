'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthShell } from '@/components/auth/AuthShell'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError('')
    return true
  }

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Password is required')
      return false
    }
    if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (value) validateEmail(value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (value) validatePassword(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Redirect to chat page with full page reload to ensure cookie is set
      window.location.href = '/chat'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell mode="login">
      <div className="bg-white rounded-2xl shadow-lg ring-1 ring-slate-200/60 p-8">
        <div className="mb-7">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign in</h2>
          <p className="text-slate-600">
            Resume your sessions and see who’s online.{' '}
            <Link href="/register" className="font-semibold text-[#1E9A80] hover:text-[#167A67]">
              New? Create an account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => email && validateEmail(email)}
              disabled={loading}
              autoComplete="email"
              inputMode="email"
              autoFocus
              className={`h-11 focus-visible:ring-[#1E9A80] focus-visible:border-[#1E9A80] ${emailError ? 'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500' : ''}`}
            />
            {emailError && <p className="text-sm text-red-600">{emailError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => password && validatePassword(password)}
              disabled={loading}
              autoComplete={rememberMe ? 'current-password' : 'off'}
              className={`h-11 focus-visible:ring-[#1E9A80] focus-visible:border-[#1E9A80] ${passwordError ? 'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500' : ''}`}
            />
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="h-4 w-4 rounded border-slate-300 accent-[#1E9A80]"
              />
              Remember me
            </label>
            <span className="text-xs text-slate-500">Takes a few seconds</span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#1E9A80] hover:bg-[#167A67] text-white font-semibold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </div>
    </AuthShell>
  )
}

