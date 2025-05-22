export interface Client {
  id: string
  name: string
  email: string
  phone: string
  country: string
  town: string
  zipCode: string
}

export interface CreateClientInput {
  name: string
  email: string
  phone: string
  address: string
}

export interface ClientTableItem extends Client {
  total_jobs: number
  total_revenue: number
}
