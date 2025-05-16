export interface Rate {
  id: string
  name: string
  description: string
  value: number
  created_at: Date
  updated_at: Date
}

export interface CreateRateInput {
  name: string
  description: string
  value: number
}

export interface UpdateRateInput extends CreateRateInput {
  id: string
}
