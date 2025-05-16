import { prisma } from "@/lib/prisma";
import { WorkersHeader } from "@/components/workers/WorkersHeader";
import { WorkersTable } from "@/components/workers/WorkersTable";
import type { WorkerTableItem } from "@/types/worker";

export default async function WorkersPage() {
  const workersData = await prisma.worker.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Convert Decimal objects to regular numbers for serialization
  const workers: WorkerTableItem[] = workersData.map(worker => ({
    id: worker.id,
    name: worker.name,
    email: worker.email || "",
    phone: worker.phone || "",
    country: worker.country || "",
    town: worker.town || "",
    zipCode: worker.zipCode || "",
    hourly_rate: worker.hourly_rate ? Number(worker.hourly_rate) : 0
  }));

  return (
    <main className="container mx-auto py-6 px-4">
      <WorkersHeader />
      <div className="mt-8">
        <WorkersTable workers={workers} />
      </div>
    </main>
  );
}
