"use client"

import { useRouter } from "next/navigation"
import { JobForm } from "@/components/jobs/JobForm"
import type { JobFormData } from "@/lib/validations/job"

export function NewJobForm() {
  const router = useRouter()

  const handleSubmit = async (data: JobFormData) => {
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create job")
      }

      router.refresh()
      router.push("/jobs")
    } catch (error) {
      console.error("Error creating job:", error)
    }
  }

  return <JobForm onSubmit={handleSubmit} />
}
