import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";

export default function EditClientLoading() {
  return (
    <main className="container mx-auto py-6 px-4 space-y-4">
      <PageHeader
        title="Edit Client"
        description="Loading client details..."
      />
      <div className="mx-auto max-w-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
