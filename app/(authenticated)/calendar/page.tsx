import Calendar from "@/components/calendar/Calendar";
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";

export default function CalendarPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Calendar" description="View your scheduled jobs" />
      <div className="h-[calc(100vh-12rem)]">
        <Calendar />
      </div>
    </div>
  );
}
