"use client"

import { useRouter } from "next/navigation"
import { JobForm } from "@/components/jobs/JobForm"
import type { Job } from "@/types/job"
import type { JobFormData } from "@/lib/validations/job"

interface EditJobFormProps {
  job: Job
}

export function EditJobForm({ job }: EditJobFormProps) {
  const router = useRouter()

  const handleSubmit = async (data: JobFormData) => {
    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update job")
      }

      router.refresh()
      router.push("/jobs")
    } catch (error) {
      console.error("Error updating job:", error)
    }
  }

  // Convert dates to string format for the form
  const formattedJob = {
    ...job,
    start_date: job.start_date instanceof Date 
      ? job.start_date.toISOString().split('T')[0]
      : job.start_date,
    end_date: job.end_date instanceof Date 
      ? job.end_date.toISOString().split('T')[0]
      : job.end_date,
    clientId: job.client?.id || "",
  }

  return <JobForm defaultValues={formattedJob} onSubmit={handleSubmit} />
}
