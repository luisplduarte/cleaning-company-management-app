import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";
import { Button } from "@/components/ui/elements/button/Button";
import { JobsTable } from "@/components/jobs/JobsTable";
import { JobType, JobStatus } from "@/lib/validations/job";

async function getClient(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      jobs: {
        orderBy: {
          start_date: 'desc'
        },
        include: {
          assignments: {
            include: {
              worker: true
            }
          }
        }
      }
    }
  });

  if (!client) {
    return null;
  }

  return {
    id: client.id,
    name: client.name,
    email: client.email,
    jobs: client.jobs.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      type: job.type as JobType,
      status: job.status as JobStatus,
      start_date: job.start_date,
      end_date: job.end_date,
      workers: job.assignments.map(assignment => ({
        id: assignment.worker.id,
        name: assignment.worker.name || ''
      }))
    }))
  };
}

export default async function ClientPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const client = await getClient(params.id);

  if (!client) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={client.name}
          description={`Email: ${client.email || 'Not provided'}`}
        />
        {session.user.role === "ADMIN" && (
          <div className="flex space-x-2">
            <Link href={`/clients/${client.id}/edit`}>
              <Button variant="outline">Edit Client</Button>
            </Link>
            <Link href="/jobs/new">
              <Button>New Job</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Jobs</h2>
        {client.jobs.length === 0 ? (
          <p className="text-gray-500">No jobs found for this client.</p>
        ) : (
          <JobsTable jobs={client.jobs} />
        )}
      </div>
    </div>
  );
}
