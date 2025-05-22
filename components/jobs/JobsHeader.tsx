"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";
import { Button } from "@/components/ui/elements/button/Button";

interface JobsHeaderProps {
  title: string;
  description?: string;
}

export function JobsHeader({ title, description }: JobsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <PageHeader
        title={title}
        description={description}
      />
      <Button onClick={() => router.push("/jobs/new")}>
        Create Job
      </Button>
    </div>
  );
}
