import { PageHeader } from "@/components/ui/PageHeader"
import { LoadingScreen } from "@/components/ui/LoadingScreen"

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
