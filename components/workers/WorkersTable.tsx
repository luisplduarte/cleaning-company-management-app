"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { WorkerTableItem } from "@/types/worker";

interface WorkersTableProps {
  workers: WorkerTableItem[];
}

export function WorkersTable({ workers }: WorkersTableProps) {
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
      window.location.reload();
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
    <div className="rounded-md border">
      <div className="overflow-x-auto">
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/workers/${worker.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {worker.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{worker.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{worker.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {`${worker.town}, ${worker.country}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button
                    href={`/workers/${worker.id}/edit`}
                    variant="ghost"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingId(worker.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
