import { Button } from "@/components/ui/elements/button/Button";
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";

export function WorkersHeader() {
  return (
    <PageHeader
      title="Workers"
      description="Manage your company's workers"
    >
      <Button href="/workers/new" size="sm">
        Create Worker
      </Button>
    </PageHeader>
  );
}
