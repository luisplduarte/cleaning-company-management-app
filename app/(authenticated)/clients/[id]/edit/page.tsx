import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { EditClientForm } from "@/components/clients/EditClientForm";
import { prisma } from "@/lib/prisma";

async function getClient(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client) {
    return null;
  }

  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    country: client.country,
    town: client.town,
    zipCode: client.zipCode
  };
}

export default async function EditClientPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const client = await getClient(params.id);

  if (!client) {
    notFound();
  }

  return (
    <main className="container mx-auto py-6 px-4 space-y-4">
      <PageHeader
        title="Edit Client"
        description={`Edit ${client.name}`}
      />

      <div className="mx-auto max-w-2xl">
        <EditClientForm client={client} />
      </div>
    </main>
  );
}
