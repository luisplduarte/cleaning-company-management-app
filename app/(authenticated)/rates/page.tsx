import { prisma } from "@/lib/prisma";
import { RatesHeader } from "@/components/rates/RatesHeader";
import { RatesTable } from "@/components/rates/RatesTable";
import type { Rate } from "@/types/rate";

export default async function RatesPage() {
  const ratesData = await prisma.rate.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Convert Decimal objects to regular numbers for serialization
  const rates: Rate[] = ratesData.map(rate => ({
    id: rate.id,
    name: rate.name,
    description: rate.description,
    value: Number(rate.value),
    created_at: rate.created_at,
    updated_at: rate.updated_at
  }));

  return (
    <main className="container mx-auto py-6 px-4">
      <RatesHeader />
      <div className="mt-8">
        <RatesTable rates={rates} />
      </div>
    </main>
  );
}
