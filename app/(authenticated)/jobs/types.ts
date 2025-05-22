import { Client } from "../clients/types"
import { Worker } from "../workers/types"

export interface Job {
  id: string
  title: string
  description: string
  location: string
  type: JobType
  status: JobStatus
  start_date: string | Date
  end_date: string | Date
  client?: Client
  assignments?: Array<{
    id: string
    worker: Worker
  }>
  created_at: Date
  updated_at: Date
}

export interface JobTableItem {
  id: string
  title: string
  description: string
  location: string
  type: JobType
  status: JobStatus
  start_date: Date
  end_date: Date
  client?: Client
  clientId: string
}

export enum JobType {
  RESIDENTIAL = "RESIDENTIAL",
  COMMERCIAL = "COMMERCIAL",
  INDUSTRIAL = "INDUSTRIAL"
}

export enum JobStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}
