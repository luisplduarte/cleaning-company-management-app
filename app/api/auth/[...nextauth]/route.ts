import NextAuth from 'next-auth'
import type { NextAuthConfig, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { Session } from 'next-auth'
import { prisma } from '@/lib/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from '@/lib/supabase'
import { Role } from '@prisma/client'

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { 
          type: "email", 
          label: "Email",
          required: true 
        },
        password: { 
          type: "password", 
          label: "Password",
          required: true 
        }
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>>, request: Request) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        })

        if (error || !user) {
          return null
        }

        const dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        })

        if (!dbUser) {
          return null
        }

        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT & { role?: Role }, user: User & { role?: Role } }) {
      if (user) {
        token.role = user.role || Role.CLIENT
      }
      return token
    },
    async session({ session, token }: { session: Session, token: JWT & { role?: Role } }) {
      if (session.user) {
        session.user.role = token.role || Role.CLIENT
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
