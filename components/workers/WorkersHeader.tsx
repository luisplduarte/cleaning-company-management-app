import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export function WorkersHeader() {
  return (
    <PageHeader
      title="Workers"
      description="Manage your company's workers"
    >
      <Button href="/workers/new" size="sm">
        Add Worker
      </Button>
    </PageHeader>
  );
}
