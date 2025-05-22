'use client'

import { useEffect } from "react"
import { Button } from "@/components/ui/elements/button/Button"

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
  message?: string
  backHref?: string
  backLabel?: string
}

export function ErrorBoundary({
  error,
  reset,
  message,
  backHref = "/",
  backLabel = "Go back home",
}: ErrorBoundaryProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="container mx-auto grid min-h-[400px] place-items-center px-4 py-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Something went wrong!</h2>
        <p className="mt-2 text-base leading-7 text-gray-600">
          {message || error.message || "An unexpected error occurred"}
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="secondary" href={backHref}>{backLabel}</Button>
        </div>
      </div>
    </main>
  )
}
