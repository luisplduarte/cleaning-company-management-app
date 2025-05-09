import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="flex justify-end space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}
