export interface CreateRateInput {
  name: string
  description: string
  value: number
}

export interface SystemRateInput {
  value: number
}

export interface Rate extends CreateRateInput {
  id: string
  is_system?: boolean
  created_at: Date
  updated_at: Date
}

export interface RateTableItem extends Rate {
  name: string
  description: string
  value: number
  is_system: boolean
}
