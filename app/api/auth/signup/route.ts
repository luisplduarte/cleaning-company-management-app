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
