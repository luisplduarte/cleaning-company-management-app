"use client"

import { useState } from "react"
import Link from "next/link"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import type { JobTableItem } from "../types"
import { JobStatus } from "../utils/job"
import { Button } from "@/components/ui/elements/button/Button"
import { ConfirmDialog } from "@/components/ui/organisms/confirm-dialog/ConfirmDialog"

interface JobsTableProps {
  jobs: JobTableItem[]
}

export function JobsTable({ jobs }: JobsTableProps) {
  const [deleteJob, setDeleteJob] = useState<JobTableItem | null>(null)

  const handleDelete = async (job: JobTableItem) => {
    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete job")
      }

      window.location.reload()
    } catch (error) {
      console.error("Error deleting job:", error)
    } finally {
      setDeleteJob(null)
    }
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No jobs found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {job.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.type.replace("_", " ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      job.status === JobStatus.COMPLETED
                        ? "bg-green-100 text-green-800"
                        : job.status === JobStatus.IN_PROGRESS
                        ? "bg-blue-100 text-blue-800"
                        : job.status === JobStatus.CANCELLED
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {job.status.toLowerCase().replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.client?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(job.start_date).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(job.end_date).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link href={`/jobs/${job.id}/edit`}>
                      <Button
                        variant="secondary"
                        size="sm"
                        aria-label="Edit job"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      aria-label="Delete job"
                      onClick={() => setDeleteJob(job)}
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

      <ConfirmDialog
        isOpen={!!deleteJob}
        title="Delete Job"
        message={`Are you sure you want to delete "${deleteJob?.title}"? This action cannot be undone.`}
        onConfirm={() => {
          if (deleteJob) {
            handleDelete(deleteJob);
          }
        }}
        onCancel={() => setDeleteJob(null)}
      />
    </>
  )
}
