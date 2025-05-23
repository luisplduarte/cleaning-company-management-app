import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";
import Charts from "@/components/dashboard/Charts";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Welcome to your dashboard" />
      <Charts />
    </div>
  );
}
