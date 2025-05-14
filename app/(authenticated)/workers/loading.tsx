import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function WorkersLoading() {
  return (
    <div className="container py-6">
      <PageHeader
        title="Workers"
        description="Manage your company's workers"
      >
        <Skeleton className="h-9 w-24" />
      </PageHeader>
      
      <div className="mt-8">
        <div className="rounded-md border">
          <div className="p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 py-3"
              >
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
