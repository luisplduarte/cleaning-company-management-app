"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import type { WorkerTableItem } from "@/types/worker";

interface WorkersTableProps {
  workers: WorkerTableItem[];
}

export function WorkersTable({ workers }: WorkersTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  async function deleteWorker(id: string) {
    try {
      const response = await fetch(`/api/workers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete worker");
      }

      toast({
        title: "Success",
        message: "Worker deleted successfully",
        type: "success"
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        message: "Error deleting worker",
        type: "error"
      });
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  }

  if (workers.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No workers found.
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full overflow-hidden">
      <div className="w-full border rounded-md overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workers.map((worker) => (
                <tr key={worker.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {worker.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {`${worker.town}, ${worker.country}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/workers/${worker.id}`)}
                      >
                        <FiEye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/workers/${worker.id}/edit`)}
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingId(worker.id)}
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Worker"
        message="Are you sure you want to delete this worker? This action cannot be undone."
        onConfirm={() => deletingId && deleteWorker(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
