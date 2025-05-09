import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { NewClientForm } from "@/components/clients/NewClientForm";

export default async function NewClientPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="New Client"
        description="Create a new client"
      />

      <div className="mx-auto max-w-2xl">
        <NewClientForm />
      </div>
    </div>
  );
}
