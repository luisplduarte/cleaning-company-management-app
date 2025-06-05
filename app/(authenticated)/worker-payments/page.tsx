import PaymentsTable from "@/components/payments/WorkerPaymentsTable"
import PaymentsHeader from "@/components/payments/PaymentsHeader"

export default function WorkerPaymentsPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <PaymentsHeader title="Worker Payments" />
      <p>Track and manage worker payment records. The status can be updated to reflect the current state of each payment.</p>
      <PaymentsTable />
    </div>
  )
}
