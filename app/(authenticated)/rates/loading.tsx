import { RatesHeader } from "./components/RatesHeader";
import { TableSkeleton } from "@/components/ui/table/TableSkeleton";

export default function RatesLoading() {
  return (
    <main className="container mx-auto py-6 px-4">
      <RatesHeader />
      <div className="mt-8">
        <TableSkeleton columns={4} rows={5} />
      </div>
    </main>
  );
}
