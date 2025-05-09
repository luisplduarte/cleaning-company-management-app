"use client"

import { ClientForm } from "@/components/clients/ClientForm"

export function NewClientForm() {
  return (
    <ClientForm
      mode="create"
      initialData={{
        name: "",
      }}
    />
  )
}
