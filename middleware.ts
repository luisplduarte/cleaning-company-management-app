import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Check for admin-only routes
  const adminRoutes = ['/clients/new']
  if (adminRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all authenticated routes
    '/((?!api|_next/static|_next/image|auth|favicon.ico).*)',
  ]
}
