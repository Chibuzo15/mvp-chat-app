import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Return the JWT so Socket.IO can authenticate via handshake auth.
  // (HTTP auth still relies on the HttpOnly cookie; this is socket-specific.)
  return NextResponse.json({ token })
}

