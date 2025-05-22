import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";
import CalendarSkeleton from "@/components/calendar/CalendarSkeleton";

export default function CalendarLoading() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Calendar" description="View your scheduled jobs" />
      <div className="h-[calc(100vh-12rem)]">
        <CalendarSkeleton />
      </div>
    </div>
  );
}
