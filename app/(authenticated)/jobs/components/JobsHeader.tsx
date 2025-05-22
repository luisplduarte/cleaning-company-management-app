import Link from "next/link"
import { FiPlus } from "react-icons/fi"
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader"
import { Button } from "@/components/ui/elements/button/Button"

interface JobsHeaderProps {
  title: string
  description: string
}

export function JobsHeader({ title, description }: JobsHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <PageHeader title={title} description={description} />
      <Link href="/jobs/new">
        <Button>
          <FiPlus className="mr-2 h-4 w-4" />
          New Job
        </Button>
      </Link>
    </div>
  )
}
