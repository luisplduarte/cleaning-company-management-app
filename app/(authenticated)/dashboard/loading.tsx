import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader"
import { LoadingScreen } from "@/components/ui/layout/loading-screen/LoadingScreen"

export default function DashboardLoadingPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <PageHeader
        title="Dashboard"
        description="Overview of your cleaning business"
      />
      <LoadingScreen fullScreen={false} className="mt-8" />
    </main>
  )
}
