"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/elements/button/Button";
import { ConfirmDialog } from "@/components/ui/organisms/confirm-dialog/ConfirmDialog";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import type { Rate } from "../types";

interface RatesTableProps {
  rates: Rate[];
}

export function RatesTable({ rates }: RatesTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  async function deleteRate(id: string) {
    try {
      const response = await fetch(`/api/rates/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete rate");
      }

      toast({
        title: "Success",
        message: "Rate deleted successfully",
        type: "success"
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        message: "Error deleting rate",
        type: "error"
      });
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  }

  if (rates.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No rates found.
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
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rates.map((rate) => (
                <tr key={rate.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {rate.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rate.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rate.value}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/rates/${rate.id}`)}
                      >
                        <FiEye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/rates/${rate.id}/edit`)}
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingId(rate.id)}
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
        title="Delete Rate"
        message="Are you sure you want to delete this rate? This action cannot be undone."
        onConfirm={() => deletingId && deleteRate(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
