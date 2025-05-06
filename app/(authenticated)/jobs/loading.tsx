import { PageHeader } from "@/components/ui/PageHeader"
import { LoadingScreen } from "@/components/ui/LoadingScreen"
import { Button } from "@/components/ui/Button"

export default function JobsLoadingPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <PageHeader
        title="Jobs"
        description="Manage your cleaning jobs"
      >
        <Button href="/jobs/new">Create Job</Button>
      </PageHeader>

      <div className="mt-8">
        <div className="space-y-4">
          {/* Search and filter skeleton */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 sm:w-96" />
            <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200" />
          </div>

          {/* Table skeleton */}
          <div className="overflow-hidden rounded-md border border-gray-200">
            <div className="bg-gray-50 px-6 py-3">
              <div className="grid grid-cols-8 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 animate-pulse rounded bg-gray-200"
                  />
                ))}
              </div>
            </div>

            <div className="divide-y divide-gray-200 bg-white">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="grid grid-cols-8 gap-4">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <div
                        key={j}
                        className="h-4 animate-pulse rounded bg-gray-100"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
