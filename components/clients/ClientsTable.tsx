"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientTableItem } from "@/types/client";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/lib/toast";

interface ClientsTableProps {
  clients: ClientTableItem[];
  isAdmin: boolean;
}

export function ClientsTable({ clients, isAdmin }: ClientsTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/clients/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete client");
      }

      toast({
        title: "Success",
        message: "Client deleted successfully",
        type: "success"
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        message: "Failed to delete client",
        type: "error"
      });
    } finally {
      setDeleteId(null);
    }
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No clients found</p>
        {isAdmin && (
          <Button onClick={() => router.push("/clients/new")}>Add Client</Button>
        )}
      </div>
    );
  }

  return (
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
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => router.push(`/clients/${client.id}`)}
                    className="text-primary hover:underline font-medium"
                  >
                    {client.name}
                  </button>
                </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {`${client.town}, ${client.zipCode}, ${client.country}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/clients/${client.id}`)}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/clients/${client.id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteId(client.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
      />
    </div>
  );
}
