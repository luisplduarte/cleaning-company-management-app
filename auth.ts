import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import type { User } from "next-auth"
import { Role } from "@prisma/client"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email", 
          placeholder: "example@acme.com" 
        },
        password: { 
          label: "Password", 
          type: "password", 
          placeholder: "••••••••" 
        }
      },
      async authorize(credentials, _req) {
        try {
          const email = credentials?.email
          const password = credentials?.password

          if (!email || !password) {
            return null
          }

          const dbUser = await prisma.user.findUnique({
            where: {
              email,
            },
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            }
          })

          if (!dbUser) {
            return null
          }

          // For development, we're accepting any password
          // In production, you would verify the password here
          // const isValidPassword = await compare(password, user.password)
          // if (!isValidPassword) return null

          const user: User = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
          }

          return user
        } catch (error) {
          console.error("Error in authorize:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role as Role
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    }
  }
})
