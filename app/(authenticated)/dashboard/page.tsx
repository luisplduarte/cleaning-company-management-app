import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Dashboard" description="Welcome to your dashboard" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Dashboard content will be added here */}
      </div>
    </div>
  );
}
