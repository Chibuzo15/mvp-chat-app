'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthShell } from '@/components/auth/AuthShell'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validateName = (value: string) => {
    if (!value) {
      setNameError('Name is required')
      return false
    }
    if (value.length < 2) {
      setNameError('Name must be at least 2 characters')
      return false
    }
    setNameError('')
    return true
  }

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
    if (value.length > 50) {
      setPasswordError('Password must be less than 50 characters')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    if (value) validateName(value)
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

    const isNameValid = validateName(name)
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
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
    <AuthShell mode="register">
      <div className="bg-white rounded-2xl shadow-lg ring-1 ring-slate-200/60 p-8">
        <div className="mb-7">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
          <p className="text-slate-600">
            Start a chat, track sessions, and see presence live.{' '}
            <Link href="/login" className="font-semibold text-[#1E9A80] hover:text-[#167A67]">
              Already have one? Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <Label htmlFor="name" className="text-slate-700 font-medium">
              Full name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={handleNameChange}
              onBlur={() => name && validateName(name)}
              disabled={loading}
              autoComplete="name"
              autoFocus
              className={`h-11 focus-visible:ring-[#1E9A80] focus-visible:border-[#1E9A80] ${nameError ? 'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500' : ''}`}
            />
            {nameError && <p className="text-sm text-red-600">{nameError}</p>}
          </div>

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
              placeholder="At least 6 characters"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => password && validatePassword(password)}
              disabled={loading}
              autoComplete="new-password"
              className={`h-11 focus-visible:ring-[#1E9A80] focus-visible:border-[#1E9A80] ${passwordError ? 'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500' : ''}`}
            />
            {passwordError ? (
              <p className="text-sm text-red-600">{passwordError}</p>
            ) : (
              <p className="text-xs text-slate-500">Must be at least 6 characters long</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#1E9A80] hover:bg-[#167A67] text-white font-semibold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </Button>
        </form>
      </div>
    </AuthShell>
  )
}

