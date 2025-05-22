import { Spinner } from "@/components/ui/elements/spinner/Spinner"

export default function ClientPaymentsLoading() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    </div>
  )
}
