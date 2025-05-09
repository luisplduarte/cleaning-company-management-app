import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { JobsTable } from "@/components/jobs/JobsTable"
import { JobsHeader } from "@/components/jobs/JobsHeader"
import { JobType, JobStatus } from "@/lib/validations/job"
import type { JobTableItem } from "@/types/job"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Jobs",
  description: "View and manage your cleaning jobs.",
}

export default async function JobsPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  const jobs = await prisma.job.findMany({
    orderBy: {
      created_at: 'desc',
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  // Convert Prisma enums to our app enums and format dates
  const formattedJobs: JobTableItem[] = jobs.map(job => ({
    id: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    type: job.type as JobType,
    status: job.status as JobStatus,
    start_date: job.start_date,
    end_date: job.end_date,
    client: job.client,
    clientId: job.clientId,
  }))

  return (
    <main className="container mx-auto py-6 px-4">
      <JobsHeader
        title="Jobs"
        description="Manage your cleaning jobs"
      />

      <div className="mt-8">
        <JobsTable jobs={formattedJobs} />
      </div>
    </main>
  )
}
