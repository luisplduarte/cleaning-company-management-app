import { PageHeader } from "@/components/ui/PageHeader"
import { LoadingScreen } from "@/components/ui/LoadingScreen"

export default function EditJobLoadingPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <PageHeader
        title="Edit Job"
        description="Update job details and status"
      />
      
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
