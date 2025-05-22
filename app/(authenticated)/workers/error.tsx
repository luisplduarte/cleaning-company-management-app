"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/elements/button/Button";
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";

export default function WorkersError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-6">
      <PageHeader
        title="Error"
        description="Something went wrong while loading workers"
      >
        <Button onClick={reset} variant="ghost" size="sm">
          Try again
        </Button>
      </PageHeader>

      <div className="mt-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
