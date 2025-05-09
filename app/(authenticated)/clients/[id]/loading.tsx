import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="px-4 py-5 sm:px-6">
                <div className="space-y-4">
                  <Skeleton className="h-5 w-1/3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
