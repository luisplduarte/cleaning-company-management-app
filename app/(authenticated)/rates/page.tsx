"use client";

import { RatesHeader } from "./components/RatesHeader";
import { RatesTable } from "./components/RatesTable";
import { useRatesData } from "./hooks/useRatesData";
import { TableSkeleton } from "@/components/ui/table/TableSkeleton";
export default function RatesPage() {
  const { data: rates, error, isLoading } = useRatesData();

  if (error) {
    throw error; // This will be caught by the error boundary
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <RatesHeader />
      <div className="mt-8">
        {isLoading ? (
          <TableSkeleton columns={4} rows={5} />
        ) : rates ? (
          <RatesTable rates={rates} />
        ) : null}
      </div>
    </main>
  );
}
