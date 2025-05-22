'use client';

import { ErrorBoundary } from "@/components/ui/layout/error-boundary/ErrorBoundary";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBoundary
      error={error}
      reset={reset}
      message="There was a problem loading the client details. Please try again."
      backHref="/clients"
      backLabel="Back to clients"
    />
  );
}
