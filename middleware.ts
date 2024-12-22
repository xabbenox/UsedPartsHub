import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify, JwtPayload } from 'jsonwebtoken'

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set')
const JWT_SECRET = process.env.JWT_SECRET

interface CustomJwtPayload extends JwtPayload {
  userId: number;
  isAdmin: boolean;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/admin') ||
      request.nextUrl.pathname === '/new') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const decoded = verify(token, JWT_SECRET) as CustomJwtPayload
      if (request.nextUrl.pathname.startsWith('/admin') && !decoded.isAdmin) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/new'],
}

