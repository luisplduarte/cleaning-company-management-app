import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";
import Link from "next/link";
import { Button } from "@/components/ui/elements/button/Button";
import { FiEdit2 } from "react-icons/fi";

interface Props {
  params: {
    id: string;
  };
}

export default async function RateDetailsPage({ params }: Props) {
  const rate = await prisma.rate.findUnique({
    where: { id: params.id },
  });

  if (!rate) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <PageHeader
        title={rate.name}
        description="Rate Details"
      >
          <Link href={`/rates/${params.id}/edit`}>
            <Button>
              <FiEdit2 className="h-4 w-4 mr-2" />
              Edit Rate
            </Button>
          </Link>
      </PageHeader>

      <div className="mt-8 space-y-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1 text-sm text-gray-900">{rate.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Rate Value</h3>
                <p className="mt-1 text-sm text-gray-900">{Number(rate.value)}%</p>
              </div>

              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-sm text-gray-900">{rate.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {rate.created_at.toLocaleDateString()}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {rate.updated_at.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
