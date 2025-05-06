import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      const isOnJobs = nextUrl.pathname.startsWith("/jobs")
      const isOnAuth = nextUrl.pathname.startsWith("/auth")

      if (isOnAuth) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl))
        }
        return true
      }

      if (!isLoggedIn && (isOnDashboard || isOnJobs)) {
        return false
      }

      return true
    },
  },
  providers: [], // configured in auth.ts
}
