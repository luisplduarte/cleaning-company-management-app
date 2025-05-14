"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi"
import { formatDate } from "@/lib/utils"
import type { JobTableItem } from "@/types/job"
import { JobType, JobStatus } from "@/lib/validations/job"

interface JobsTableProps {
  jobs: JobTableItem[]
}

export function JobsTable({ jobs }: JobsTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<JobStatus | "ALL">("ALL")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.client?.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "ALL" || job.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [jobs, searchTerm, statusFilter])

  const statusBadgeColors: Record<JobStatus, string> = {
    [JobStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [JobStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
    [JobStatus.COMPLETED]: "bg-green-100 text-green-800",
    [JobStatus.CANCELLED]: "bg-gray-100 text-gray-800",
  }

  const typeBadgeColors: Record<JobType, string> = {
    [JobType.RESIDENTIAL]: "bg-indigo-100 text-indigo-800",
    [JobType.COMMERCIAL]: "bg-purple-100 text-purple-800",
    [JobType.INDUSTRIAL]: "bg-orange-100 text-orange-800",
  }

  const formatStatusLabel = (status: JobStatus) => 
    status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')

  const formatTypeLabel = (type: JobType) => 
    type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()

  return (
    <div className="space-y-4 w-full overflow-hidden">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as JobStatus | "ALL")}
          className="rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="ALL">All Status</option>
          {Object.values(JobStatus).map((status) => (
            <option key={status} value={status}>
              {formatStatusLabel(status)}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full border rounded-md overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Client
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-gray-500">
                  No jobs found
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {job.title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${typeBadgeColors[job.type]}`}>
                      {formatTypeLabel(job.type)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusBadgeColors[job.status]}`}>
                      {formatStatusLabel(job.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {job.location}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(job.start_date)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(job.end_date)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {job.client?.name || '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/jobs/${job.id}`)}
                      >
                        <FiEye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/jobs/${job.id}/edit`)}
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setJobToDelete(job.id)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
          <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        onConfirm={async () => {
          if (jobToDelete) {
            try {
              const response = await fetch(`/api/jobs/${jobToDelete}`, {
                method: "DELETE",
              })

              if (!response.ok) {
                throw new Error("Failed to delete job")
              }

              router.refresh()
            } catch (error) {
              console.error("Error deleting job:", error)
            }
          }
          setIsDeleteDialogOpen(false)
          setJobToDelete(null)
        }}
        onCancel={() => {
          setIsDeleteDialogOpen(false)
          setJobToDelete(null)
        }}
      />
    </div>
      </div>
    </div>
  )
}
