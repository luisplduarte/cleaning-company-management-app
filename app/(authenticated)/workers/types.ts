export interface Worker {
  id: string
  name: string
  email: string
  phone: string
  country: string
  town: string
  zipCode: string
  hourly_rate: number | { toString(): string }
}

export interface CreateWorkerInput {
  name: string
  email: string
  phone: string
  address: string
  hourly_rate: number
}

export interface WorkerTableItem extends Worker {
  total_jobs: number
  total_hours: number
  total_earnings: number
}

export interface WorkerRateHistory {
  id: string
  worker_id: string
  rate: number
  effective_date: Date
  created_at: Date
}
