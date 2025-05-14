import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import EditWorkerForm from "@/components/workers/EditWorkerForm";

interface EditWorkerPageProps {
  params: {
    id: string;
  };
}

export default async function EditWorkerPage({ params }: EditWorkerPageProps) {
  const { id } = await params;
  const worker = await prisma.worker.findUnique({
    where: { id },
  });

  if (!worker) {
    notFound();
  }

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
