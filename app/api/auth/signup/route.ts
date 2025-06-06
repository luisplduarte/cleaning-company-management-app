import { prisma } from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"
import { signUpSchema } from "@/lib/validations/auth"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(req: Request) {
  try {
    // Validate request body
    const body = await req.json()
    const validatedData = signUpSchema.parse(body)

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          name: validatedData.name
        }
      }
    })

    if (authError) {
      // Handle specific Supabase auth errors
      if (authError.message.includes("email rate limit") || authError.message.includes("over_email_send_rate_limit")) {
        return Response.json(
          { error: "Too many signup attempts. Please try again later." },
          { status: 429 }
        )
      }
      if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
        return Response.json(
          { error: "An account with this email already exists" },
          { status: 400 }
        )
      }
      throw authError
    }

    if (!authData.user) {
      throw new Error("Failed to create user")
    }

    // Create user in our database using Prisma
    await prisma.user.create({
      data: {
        id: authData.user.id,
        email: validatedData.email,
        name: validatedData.name,
        role: "ADMIN"
      }
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Signup error:", error)
    
    // Handle Prisma unique constraint errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return Response.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }
    
    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      const zodError = error as { issues: Array<{ message: string }> }
      const firstIssue = zodError.issues[0]
      if (firstIssue?.message) {
        return Response.json(
          { error: firstIssue.message },
          { status: 400 }
        )
      }
    }
    
    if (error instanceof Error) {
      return Response.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
