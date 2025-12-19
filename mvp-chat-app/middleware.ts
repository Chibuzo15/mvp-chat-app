import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

interface TokenPayload {
  userId: string
  email: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function verifyToken(token: string): Promise<TokenPayload> {
  const secret = new TextEncoder().encode(JWT_SECRET)
  const { payload } = await jwtVerify(token, secret)
  return payload as unknown as TokenPayload
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  // Define route types
  const authPages = ['/login', '/register']
  const protectedPaths = ['/chat', '/api/chat', '/api/users', '/api/auth/me', '/api/auth/socket-token', '/api/ai']
  
  const isAuthPage = authPages.some((page) => pathname.startsWith(page))
  const isProtectedRoute = protectedPaths.some((route) => pathname.startsWith(route))

  // Verify token if present
  let isAuthenticated = false
  let userId: string | null = null

  if (token) {
    try {
      const payload = await verifyToken(token)
      isAuthenticated = true
      userId = payload.userId
    } catch (error) {
      // Token is invalid
      isAuthenticated = false
    }
  }

  // If user is authenticated and trying to access auth pages, redirect to chat
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  // If user is not authenticated and trying to access protected routes
  if (!isAuthenticated && isProtectedRoute) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If authenticated and accessing protected route, attach userId to headers
  if (isAuthenticated && isProtectedRoute && userId) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', userId)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // For all other cases, proceed normally
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/chat',
    '/login',
    '/register',
    '/api/chat/:path*',
    '/api/users',
    '/api/auth/me',
    '/api/auth/socket-token',
    '/api/ai/:path*',
  ],
}

// Middleware always runs on Edge runtime in Next.js
// Using jose library for JWT verification which is Edge-compatible

