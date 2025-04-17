import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public paths that don't require authentication
    if (path === '/auth/signin') {
      return NextResponse.next()
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Admin-only routes
    if (
      path.startsWith('/admin') &&
      token.role !== Role.ADMIN
    ) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Worker-specific routes
    if (
      path.startsWith('/worker') &&
      token.role !== Role.WORKER
    ) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

// Specify which routes to protect
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/worker/:path*',
    '/api/:path*'
  ]
}
