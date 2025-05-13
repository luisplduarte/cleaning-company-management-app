"use client"

import { ClientForm } from "@/components/clients/ClientForm"
import type { ClientResponse } from "@/types/client"

interface EditClientFormProps {
  client: ClientResponse
}

export function EditClientForm({ client }: EditClientFormProps) {
  return (
    <ClientForm
      mode="edit"
      clientId={client.id}
      initialData={{
        name: client.name,
        email: client.email,
        phone: client.phone,
        country: client.country,
        town: client.town,
        zipCode: client.zipCode
      }}
    />
  )
}
