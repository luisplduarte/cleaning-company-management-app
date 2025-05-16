import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import EditWorkerForm from "@/components/workers/EditWorkerForm";
import { WorkerResponse } from "@/types/worker";

interface EditWorkerPageProps {
  params: {
    id: string;
  };
}

export default async function EditWorkerPage({ params }: EditWorkerPageProps) {
  const { id } = await params;
  const workerData = await prisma.worker.findUnique({
    where: { id },
  });

  if (!workerData) {
    notFound();
  }

  // Convert Decimal hourly_rate to regular number for serialization
  const worker: WorkerResponse = {
    id: workerData.id,
    name: workerData.name,
    email: workerData.email || "",
    phone: workerData.phone || "",
    country: workerData.country || "",
    town: workerData.town || "",
    zipCode: workerData.zipCode || "",
    hourly_rate: workerData.hourly_rate ? Number(workerData.hourly_rate) : 0
  };

  return (
    <main className="container mx-auto py-6 px-4">
      <PageHeader 
        title="Edit Worker" 
        description="Update worker information"
      />

      <div className="mt-8">
        <EditWorkerForm worker={worker} />
      </div>
    </main>
  );
}
