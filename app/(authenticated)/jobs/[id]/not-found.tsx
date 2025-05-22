import { Button } from "@/components/ui/elements/button/Button"

export default function JobNotFound() {
  return (
    <main className="container mx-auto grid min-h-[400px] place-items-center px-4 py-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Job not found</h2>
        <p className="mt-2 text-base leading-7 text-gray-600">
          The job you're looking for doesn't exist or has been deleted.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button href="/jobs">Back to jobs</Button>
          <Button variant="secondary" href="/jobs/new">Create new job</Button>
        </div>
      </div>
    </main>
  )
}
