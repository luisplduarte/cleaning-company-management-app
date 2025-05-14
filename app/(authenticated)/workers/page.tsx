import { prisma } from "@/lib/prisma";
import { WorkersHeader } from "@/components/workers/WorkersHeader";
import { WorkersTable } from "@/components/workers/WorkersTable";
import type { WorkerTableItem } from "@/types/worker";

export default async function WorkersPage() {
  const workers = await prisma.worker.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="container py-6">
      <WorkersHeader />
      <div className="mt-8">
        <WorkersTable workers={workers as WorkerTableItem[]} />
      </div>
    </div>
  );
}
