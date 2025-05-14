import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { prisma } from "@/lib/prisma";

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
      }
    }
  });

  if (!worker) {
    notFound();
  }

  return (
    <div className="container py-6">
      <PageHeader 
        title={worker.name}
        description="Worker details"
      >
        <div className="flex gap-2">
          <Button href={`/workers/${id}/edit`} variant="ghost" size="sm">
            Edit
          </Button>
          <Button href="/workers" variant="ghost" size="sm">
            Back to Workers
          </Button>
        </div>
      </PageHeader>

      <div className="mt-8 grid gap-8">
        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <div className="grid gap-2">
            <div>
              <span className="font-medium">Email:</span>{" "}
              <span className="text-muted-foreground">{worker.email}</span>
            </div>
            <div>
              <span className="font-medium">Phone:</span>{" "}
              <span className="text-muted-foreground">{worker.phone}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">Location</h2>
          <div className="grid gap-2">
            <div>
              <span className="font-medium">Country:</span>{" "}
              <span className="text-muted-foreground">{worker.country}</span>
            </div>
            <div>
              <span className="font-medium">Town:</span>{" "}
              <span className="text-muted-foreground">{worker.town}</span>
            </div>
            <div>
              <span className="font-medium">ZIP Code:</span>{" "}
              <span className="text-muted-foreground">{worker.zipCode}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">Assigned Jobs</h2>
          {worker.assignments.length === 0 ? (
            <p className="text-muted-foreground">No jobs assigned.</p>
          ) : (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {worker.assignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {assignment.job.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {assignment.job.client.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {assignment.job.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            href={`/jobs/${assignment.job.id}`}
                            variant="ghost"
                            size="sm"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
