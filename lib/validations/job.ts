import { z } from "zod"

export enum JobType {
  RESIDENTIAL = "RESIDENTIAL",
  COMMERCIAL = "COMMERCIAL",
  INDUSTRIAL = "INDUSTRIAL",
}

export enum JobStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

// Define allowed status transitions
export const statusTransitions: Record<JobStatus, JobStatus[]> = {
  [JobStatus.PENDING]: [JobStatus.IN_PROGRESS, JobStatus.CANCELLED],
  [JobStatus.IN_PROGRESS]: [JobStatus.COMPLETED, JobStatus.CANCELLED],
  [JobStatus.COMPLETED]: [],
  [JobStatus.CANCELLED]: [],
}

const jobBaseSchema = {
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  type: z.nativeEnum(JobType, {
    required_error: "Job type is required",
    invalid_type_error: "Invalid job type",
  }),
  status: z.nativeEnum(JobStatus, {
    required_error: "Status is required",
    invalid_type_error: "Invalid status",
  }),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  clientId: z.string().min(1, "Client is required"),
}

export const jobFormSchema = z.object({
  ...jobBaseSchema,
  start_date: z.string().min(1, "Start date and time is required"),
  end_date: z.string().min(1, "End date and time is required"),
}).refine(data => {
  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  return end > start;
}, {
  message: "End date must be after start date",
  path: ["end_date"],
})

export const jobUpdateSchema = z.object({
  ...jobBaseSchema,
}).partial()

export type JobFormData = z.infer<typeof jobFormSchema>
export type JobUpdateData = z.infer<typeof jobUpdateSchema>

export const defaultJobValues: JobFormData = {
  title: "",
  description: "",
  location: "",
  type: JobType.RESIDENTIAL,
  status: JobStatus.PENDING,
  start_date: "",
  end_date: "",
  clientId: "", // This will need to be set when we implement client selection
}
