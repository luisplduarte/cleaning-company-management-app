"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";
import { Button } from "@/components/ui/elements/button/Button";
import { FiPlus } from "react-icons/fi";

export function RatesHeader() {
  return (
    <PageHeader
      title="Rates"
      description="Manage your company's rate settings"
    >
      <Link href="/rates/new">
        <Button>
          <FiPlus className="h-4 w-4 mr-2" />
          New Rate
        </Button>
      </Link>
    </PageHeader>
  );
}
