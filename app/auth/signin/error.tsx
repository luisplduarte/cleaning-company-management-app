'use client'

import { ErrorBoundary } from "@/components/ui/layout/error-boundary/ErrorBoundary"

export default function SignInErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorBoundary
      error={error}
      reset={reset}
      message="Failed to authenticate"
      backHref="/"
      backLabel="Go back home"
    />
  )
}
