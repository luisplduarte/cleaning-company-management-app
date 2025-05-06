import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/Button"

export const metadata: Metadata = {
  title: "Welcome",
  description: "Cleaning company management system - organize your cleaning services efficiently.",
}

export default async function HomePage() {
  const session = await auth()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="container mx-auto grid min-h-screen place-items-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Cleaning Company Management
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
          Streamline your cleaning service operations with our comprehensive management system.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button href="/auth/signin" size="lg">
            Sign In
          </Button>
          <Button href="/auth/signup" variant="secondary" size="lg">
            Sign Up
          </Button>
        </div>
      </div>
    </main>
  )
}
