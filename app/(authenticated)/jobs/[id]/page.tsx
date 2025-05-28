import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader"
import { Button } from "@/components/ui/elements/button/Button"
import { formatDate } from "@/lib/utils"

interface Props {
  params: { id: string };
}

export default async function JobPage({ params }: Props) {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      assignments: {
        select: {
          id: true,
          worker: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  })

  if (!job) {
    notFound()
  }

  // Format status for display
  const statusDisplay = job.status
    .split('_')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  return (
    <main className="container mx-auto py-6 px-4">
      <PageHeader
        title={job.title}
        description={`View job details and assignments`}
      >
        <div className="flex gap-4">
          <Button href={`/jobs/${job.id}/edit`}>
            Edit Job
          </Button>
          <Button href="/jobs" variant="secondary">
            Back to Jobs
          </Button>
        </div>
      </PageHeader>

      <div className="mt-8 space-y-8">
        <section className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Status</h2>
            <p>{statusDisplay}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Client</h2>
            <p>{job.client?.name || 'No client assigned'}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Location</h2>
            <p>{job.location}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Dates</h2>
            <p>
              {formatDate(job.start_date)} - {formatDate(job.end_date)}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="whitespace-pre-wrap">{job.description}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Assigned Workers</h2>
          {job.assignments.length > 0 ? (
            <ul className="list-disc pl-5">
              {job.assignments.map((assignment: { id: string; worker: { name: string } }) => (
                <li key={assignment.id}>{assignment.worker.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No workers assigned yet</p>
          )}
        </section>
      </div>
    </main>
  )
}
