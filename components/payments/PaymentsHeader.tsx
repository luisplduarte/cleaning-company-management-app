import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader"

interface PaymentsHeaderProps {
  title: string
}

export default function PaymentsHeader({ title }: PaymentsHeaderProps) {
  return (
    <PageHeader
      title={title}
      description="Track and manage payment records. The status can be updated to reflect the current state of each payment."
    />
  )
}
