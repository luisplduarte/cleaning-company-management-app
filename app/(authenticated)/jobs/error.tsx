'use client'

import { ErrorBoundary } from "@/components/ui/ErrorBoundary"

export default function JobsErrorPage({
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
      message="Failed to load jobs"
      backHref="/dashboard"
      backLabel="Go to Dashboard"
    />
  )
}
