"use client";

import { RatesHeader } from "./components/RatesHeader";

export default function RatesError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="container mx-auto py-6 px-4">
      <RatesHeader />
      <div className="mt-8">
        <div className="rounded-lg bg-red-50 p-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Something went wrong!
            </h2>
            <p className="text-red-600 mb-4">{error.message}</p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
