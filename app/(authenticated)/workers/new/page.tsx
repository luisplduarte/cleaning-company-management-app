import { PageHeader } from "@/components/ui/PageHeader";
import NewWorkerForm from "@/components/workers/NewWorkerForm";

export default function NewWorkerPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <PageHeader
        title="Add Worker"
        description="Create a new worker profile"
      />

      <div className="mt-8">
        <NewWorkerForm />
      </div>
    </main>
  );
}
