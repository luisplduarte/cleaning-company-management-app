import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import NewWorkerForm from "@/components/workers/NewWorkerForm";

export default function NewWorkerPage() {
  return (
    <div className="container py-6">
      <PageHeader
        title="Add Worker"
        description="Create a new worker profile"
      >
        <Button href="/workers" variant="ghost" size="sm">
          Cancel
        </Button>
      </PageHeader>

      <div className="mt-8">
        <NewWorkerForm />
      </div>
    </div>
  );
}
