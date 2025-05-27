import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";
import { ChartSkeleton } from "@/components/dashboard/ChartSkeleton";

export default function DashboardLoading() {
  return (
    <main className="container mx-auto py-6 px-4 space-y-4">
      <PageHeader title="Dashboard" description="Welcome to your dashboard" />
      <div className="grid gap-6 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <ChartSkeleton />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <ChartSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
