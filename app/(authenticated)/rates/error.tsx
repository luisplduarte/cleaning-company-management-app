"use client";

import { RatesHeader } from "@/components/rates/RatesHeader";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import { FiAlertCircle, FiRefreshCcw } from "react-icons/fi";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container mx-auto py-6 px-4">
      <RatesHeader />
      <div className="mt-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading rates
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Something went wrong! Please try again.</p>
              </div>
              <div className="mt-4">
                <Button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center"
                >
                  <FiRefreshCcw className="mr-2 h-4 w-4" />
                  Try again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
