import Calendar from '@/components/calendar/Calendar';
import { PageHeader } from '@/components/ui/PageHeader';

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Dashboard" description="View and manage your jobs" />
      <div className="h-[calc(100vh-12rem)]">
        <Calendar />
      </div>
    </div>
  );
}
