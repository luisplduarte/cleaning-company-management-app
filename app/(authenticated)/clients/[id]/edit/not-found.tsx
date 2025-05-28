import { Button } from "@/components/ui/elements/button/Button";
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";
import Link from "next/link";

export default function EditClientNotFound() {
  return (
    <main className="container mx-auto py-6 px-4 space-y-4">
      <PageHeader
        title="Client Not Found"
        description="The client you&apos;re trying to edit could not be found"
      />
      <div className="mx-auto max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-gray-600 mb-4">
            {"The client you're trying to edit may have been deleted or doesn't exist."}
          </p>
          <Link href="/clients">
            <Button variant="default">
              Return to Clients
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
