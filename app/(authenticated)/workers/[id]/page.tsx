import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WorkerDetails } from "./WorkerDetails";

interface WorkerPageProps {
  params: {
    id: string;
  };
}

export default async function WorkerPage({ params }: WorkerPageProps) {
  const { id } = await params;
  const worker = await prisma.worker.findUnique({
    where: { id },
    include: {
      assignments: {
        include: {
          job: {
            include: {
              client: true
            }
          }
        }
      },
      rate_history: {
        orderBy: {
          changed_at: 'desc'
        }
      }
    }
  });

  if (!worker) {
    notFound();
  }

  // Convert Decimal values to numbers for client component
  const workerData = {
    ...worker,
    hourly_rate: Number(worker.hourly_rate),
    rate_history: worker.rate_history.map(history => ({
      ...history,
      old_rate: Number(history.old_rate),
      new_rate: Number(history.new_rate),
      changed_at: history.changed_at.toISOString()
    }))
  };

  return <WorkerDetails worker={workerData} />;
}
