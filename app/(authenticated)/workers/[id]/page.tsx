import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WorkerDetails } from "./WorkerDetails";

interface WorkerPageProps {
  params: {
    id: string;
  };
}

export default async function WorkerPage({ params }: WorkerPageProps) {
  const worker = await prisma.worker.findUnique({
    where: { id: params.id },
    include: {
      assignments: {
        include: {
          job: {
            include: {
              client: true
            }
          }
        }
      }
    }
  });

  if (!worker) {
    notFound();
  }

  // Convert Decimal to number for client component
  const workerData = {
    ...worker,
    hourly_rate: Number(worker.hourly_rate)
  };

  return <WorkerDetails worker={workerData} />;
}
