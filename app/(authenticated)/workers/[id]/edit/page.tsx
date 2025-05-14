import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
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
    <div className="container py-6">
      <PageHeader 
        title="Edit Worker" 
        description="Update worker information"
      >
        <Button href={`/workers/${id}`} variant="ghost" size="sm">
          Cancel
        </Button>
      </PageHeader>

      <div className="mt-8">
        <EditWorkerForm worker={worker} />
      </div>
    </div>
  );
}
