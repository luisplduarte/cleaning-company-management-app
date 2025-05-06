'use client'

import { useEffect } from "react"
import { Button } from "@/components/ui/Button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <main className="container mx-auto grid min-h-screen place-items-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Something went wrong!</h2>
            <p className="mt-2 text-base leading-7 text-gray-600">
              {error.message || "An unexpected error occurred"}
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button onClick={() => reset()}>Try again</Button>
              <Button variant="secondary" href="/">Go back home</Button>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
