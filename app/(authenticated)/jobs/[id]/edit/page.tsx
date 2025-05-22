import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader"
import { EditJobForm } from "../../components/JobForm"
import { JobType, JobStatus } from "../../utils/job"
import type { Job } from "../../types"

interface EditJobPageProps {
  params: {
    id: string
  }
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      assignments: {
        include: {
          worker: true,
        },
      },
    },
  })

  if (!job) {
    notFound()
  }

  // Convert Prisma types to our app types
  const formattedJob: Job = {
    id: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    type: job.type as JobType,
    status: job.status as JobStatus,
    start_date: new Date(job.start_date).toISOString().slice(0, 16),
    end_date: new Date(job.end_date).toISOString().slice(0, 16),
    client: job.client,
    assignments: job.assignments,
    created_at: job.created_at,
    updated_at: job.updated_at,
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <PageHeader
        title="Edit Job"
        description="Update job details and assignments"
      />

      <div className="mt-8">
        <EditJobForm job={formattedJob} />
      </div>
    </main>
  )
}
