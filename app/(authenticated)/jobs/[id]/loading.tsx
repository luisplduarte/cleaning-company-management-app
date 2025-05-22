import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader"
import { Button } from "@/components/ui/elements/button/Button"

export default function JobLoadingPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <PageHeader
        title={
          <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
        }
        description={
          <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
        }
      >
        <div className="flex items-center gap-4">
          <Button variant="secondary" href="/jobs">
            Back to Jobs
          </Button>
          <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />
        </div>
      </PageHeader>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Job Details Skeleton */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-4 py-6 sm:p-8">
            <div className="space-y-4">
              <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200" />
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Client & Assignments Skeleton */}
        <div className="space-y-6">
          {/* Client Info Skeleton */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <div className="px-4 py-6 sm:p-8">
              <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>

          {/* Worker Assignments Skeleton */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <div className="px-4 py-6 sm:p-8">
              <div className="h-6 w-40 animate-pulse rounded-md bg-gray-200" />
              <div className="mt-4 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
