export interface Rate {
  id: string
  name: string
  description: string
  value: number
  is_system?: boolean
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

export interface SystemRateInput {
  value: number
}
