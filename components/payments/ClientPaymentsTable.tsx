"use client"

import { useEffect, useState } from "react"
import { ClientPayment, PaymentStatus } from "@/types/payment"
import { Button } from "../ui/Button"
import { FiEdit2, FiCheck, FiX } from "react-icons/fi"

export default function ClientPaymentsTable() {
  const [payments, setPayments] = useState<ClientPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingStatus, setEditingStatus] = useState<PaymentStatus | null>(null)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("/api/client-payments")
        const data = await response.json()
        setPayments(data)
      } catch (error) {
        console.error("Error fetching payments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const handleStatusChange = async (id: string, status: PaymentStatus) => {
    try {
      const response = await fetch(`/api/client-payments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update payment status")
      }

      const updatedPayment = await response.json()
      setPayments(payments.map(p => p.id === id ? updatedPayment : p))
    } catch (error) {
      console.error("Error updating payment status:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="rounded-md border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {payment.client.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {payment.job.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${Number(payment.amount).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {editingId === payment.id ? (
                  <select
                    value={editingStatus || payment.status}
                    onChange={(e) => setEditingStatus(e.target.value as PaymentStatus)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="WAITING_PAYMENT">Waiting Payment</option>
                    <option value="ISSUED">Issued</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                ) : (
                  <span>{payment.status}</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex gap-2 justify-end">
                  {editingId === payment.id ? (
                    <>
                      <Button
                        onClick={async () => {
                          if (editingStatus) {
                            await handleStatusChange(payment.id, editingStatus)
                            setEditingStatus(null)
                          }
                          setEditingId(null)
                        }}
                        variant="secondary"
                        size="sm"
                      >
                        <FiCheck className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingStatus(null)
                          setEditingId(null)
                        }}
                        variant="secondary"
                        size="sm"
                      >
                        <FiX className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        setEditingStatus(payment.status)
                        setEditingId(payment.id)
                      }}
                      variant="secondary"
                      size="sm"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
