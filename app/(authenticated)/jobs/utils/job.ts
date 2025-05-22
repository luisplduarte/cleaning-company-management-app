import { z } from "zod"
import { JobType, JobStatus } from "../types"

export { JobType, JobStatus }

export const jobFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  type: z.nativeEnum(JobType),
  status: z.nativeEnum(JobStatus),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  clientId: z.string().min(1, "Client is required"),
  workerId: z.string().min(1, "Worker is required"),
})

export type JobFormData = z.infer<typeof jobFormSchema>
