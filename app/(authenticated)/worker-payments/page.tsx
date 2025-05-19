import PaymentsTable from "@/components/payments/WorkerPaymentsTable"
import PaymentsHeader from "@/components/payments/PaymentsHeader"

export default function WorkerPaymentsPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <PaymentsHeader title="Worker Payments" />
      <PaymentsTable />
    </div>
  )
}
