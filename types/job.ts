import { JobType, JobStatus } from "@/lib/validations/job"

export interface Job {
  id: string
  title: string
  description: string
  location: string
  type: JobType
  status: JobStatus
  start_date: string | Date
  end_date: string | Date
  client?: {
    id: string
    name: string
  }
  assignments?: {
    id: string
    worker: {
      id: string
      name: string | null
    }
  }[]
  created_at: string | Date
  updated_at: string | Date
}

export interface JobTableItem {
  id: string
  title: string
  description: string
  location: string
  type: JobType
  status: JobStatus
  start_date: string | Date
  end_date: string | Date
  client?: {
    id: string
    name: string
  }
  clientId?: string
}
