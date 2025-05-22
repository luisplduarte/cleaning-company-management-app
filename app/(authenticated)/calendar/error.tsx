"use client";

import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";
import CalendarError from "@/components/calendar/CalendarError";

export default function CalendarErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Calendar" description="View your scheduled jobs" />
      <div className="h-[calc(100vh-12rem)]">
        <CalendarError 
          message={error.message} 
          onRetry={reset}
        />
      </div>
    </div>
  );
}
