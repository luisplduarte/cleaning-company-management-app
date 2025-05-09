"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

interface ClientsHeaderProps {
  title: string;
  description?: string;
  isAdmin: boolean;
}

export function ClientsHeader({ title, description, isAdmin }: ClientsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <PageHeader
        title={title}
        description={description}
      />
      {isAdmin && (
        <Button onClick={() => router.push("/clients/new")}>
          Add Client
        </Button>
      )}
    </div>
  );
}
