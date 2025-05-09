import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <main className="container mx-auto grid min-h-[400px] place-items-center px-4 py-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Client Not Found</h2>
        <p className="mt-2 text-base leading-7 text-gray-600">
          The client you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link href="/clients">
            <Button>Back to Clients</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
