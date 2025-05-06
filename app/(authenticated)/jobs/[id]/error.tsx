'use client'

import { ErrorBoundary } from "@/components/ui/ErrorBoundary"

export default function JobErrorPage({
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
      message="Failed to load job details"
      backHref="/jobs"
      backLabel="Back to jobs"
    />
  )
}
