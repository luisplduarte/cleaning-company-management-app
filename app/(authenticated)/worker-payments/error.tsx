"use client"

import { ErrorBoundary } from "@/components/ui/layout/error-boundary/ErrorBoundary"

export default function WorkerPaymentsError({
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
      message="Error Loading Worker Payments"
    />
  )
}
