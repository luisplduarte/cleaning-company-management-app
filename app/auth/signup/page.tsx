import SignUpForm from "@/components/auth/SignUpForm"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
}

export default function SignUpPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center p-4">
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-gray-500">
            Enter your information to create your account
          </p>
        </div>

        <SignUpForm />

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
