"use client"

import { Button } from "@/components/ui/elements/button/Button";
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";

export default function EditClientError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="container mx-auto py-6 px-4 space-y-4">
      <PageHeader
        title="Error"
        description="Something went wrong while editing the client"
      />
      <div className="mx-auto max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
        </div>
      </div>
    </main>
  );
}
