import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader"
import { NewJobForm } from "../components/JobForm"

export default async function NewJobPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <PageHeader
        title="Create Job"
        description="Create a new cleaning service job"
      />

      <div className="mt-8">
        <NewJobForm />
      </div>
    </main>
  )
}
