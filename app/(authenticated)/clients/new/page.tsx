import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";
import { NewClientForm } from "@/components/clients/NewClientForm";

export default async function NewClientPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <main className="container mx-auto py-6 px-4 space-y-4">
      <PageHeader
        title="New Client"
        description="Create a new client"
      />

      <div className="mx-auto max-w-2xl">
        <NewClientForm />
      </div>
    </main>
  );
}
