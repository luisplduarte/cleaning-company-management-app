import PaymentsTable from "@/components/payments/ClientPaymentsTable"
import PaymentsHeader from "@/components/payments/PaymentsHeader"

export default function ClientPaymentsPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <PaymentsHeader title="Client Payments" />
      <PaymentsTable />
    </div>
  )
}
