import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader"
import { LoadingScreen } from "@/components/ui/layout/loading-screen/LoadingScreen"
import { Button } from "@/components/ui/elements/button/Button"

export default function NewJobLoadingPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <PageHeader
        title="Create New Job"
        description="Add a new cleaning job to the system"
      >
        <Button variant="secondary" href="/jobs">
          Cancel
        </Button>
      </PageHeader>

      <div className="mt-8">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <LoadingScreen fullScreen={false} className="min-h-[400px]" />
          </div>
        </div>
      </div>
    </main>
  )
}
