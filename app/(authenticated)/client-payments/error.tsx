"use client"

import { ErrorBoundary } from "@/components/ui/ErrorBoundary"

export default function ClientPaymentsError({
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
      message="Error Loading Client Payments"
    />
  )
}
