'use client'

import { ErrorBoundary } from "@/components/ui/layout/error-boundary/ErrorBoundary"

export default function NewJobErrorPage({
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
      message="Failed to load form"
      backHref="/jobs"
      backLabel="Back to jobs"
    />
  )
}
