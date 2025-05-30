import { Suspense } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { LoadingScreen } from "@/components/ui/layout/loading-screen/LoadingScreen";

async function getClients() {
  const clients = await prisma.client.findMany();

  return clients.map(client => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    country: client.country,
    town: client.town,
    zipCode: client.zipCode
  }));
}

export default async function ClientsPage() {
  const session = await auth();
  const clients = await getClients();

  return (
    <main className="container mx-auto py-6 px-4 space-y-4">
      <ClientsHeader
        title="Clients"
        description="Manage your clients here."
        isAdmin={session?.user.role === "ADMIN"}
      />

      <Suspense fallback={<LoadingScreen />}>
        <ClientsTable clients={clients} isAdmin={session?.user.role === "ADMIN"} />
      </Suspense>
    </main>
  );
}
