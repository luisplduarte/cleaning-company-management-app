import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";
import Charts from "@/components/dashboard/Charts";

export default function DashboardPage() {
  return (
    <main className="container mx-auto py-6 px-4 space-y-4">
      <PageHeader title="Dashboard" description="Welcome to your dashboard" />
      <Charts />
    </main>
  );
}
