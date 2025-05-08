"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { JobFormData, JobType, JobStatus, jobFormSchema } from "@/lib/validations/job"
import type { SelectOption } from "@/components/ui/Select"
import type { Job } from "@/types/job"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { DatePicker } from "@/components/ui/DatePicker"
import { FormField } from "@/components/ui/FormField"

interface JobFormProps {
  defaultValues?: Partial<JobFormData>
  onSubmit: (data: JobFormData) => void | Promise<void>
  isSubmitting?: boolean
  clientId?: string
}

const typeOptions: SelectOption[] = Object.entries(JobType).map(([value, label]) => ({
  value,
  label: label.replace('_', ' '),
}))

const statusOptions: SelectOption[] = Object.entries(JobStatus).map(([value, label]) => ({
  value,
  label: label.replace('_', ' '),
}))

// Mock client for testing
const MOCK_CLIENTS = [
  { id: "mock-client-1", name: "Mock Client 1" },
  { id: "mock-client-2", name: "Mock Client 2" },
]

const clientOptions: SelectOption[] = MOCK_CLIENTS.map(client => ({
  value: client.id,
  label: client.name,
}))

const initialValues: JobFormData = {
  title: "",
  description: "",
  location: "",
  type: JobType.RESIDENTIAL,
  status: JobStatus.PENDING,
  start_date: "",
  end_date: "",
  clientId: MOCK_CLIENTS[0].id, // Default to first mock client
}

export function JobForm({ defaultValues, onSubmit, isSubmitting = false, clientId }: JobFormProps) {
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      ...initialValues,
      ...defaultValues,
      clientId: clientId,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        clientId: clientId,
      })
    }
  }, [defaultValues, clientId, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        id="title"
        label="Title"
        error={errors.title?.message}
        required
      >
        <Input
          {...register("title")}
          id="title"
          placeholder="Enter job title"
          error={!!errors.title}
        />
      </FormField>

      <FormField
        id="description"
        label="Description"
        error={errors.description?.message}
        required
      >
        <Textarea
          {...register("description")}
          id="description"
          placeholder="Enter job description"
          error={!!errors.description}
        />
      </FormField>

      <FormField
        id="location"
        label="Location"
        error={errors.location?.message}
        required
      >
        <Input
          {...register("location")}
          id="location"
          placeholder="Enter job location"
          error={!!errors.location}
        />
      </FormField>

      <FormField
        id="type"
        label="Type"
        error={errors.type?.message}
        required
      >
        <Select
          {...register("type")}
          options={typeOptions}
          id="type"
          placeholder="Select job type"
          error={!!errors.type}
        />
      </FormField>

      <FormField
        id="status"
        label="Status"
        error={errors.status?.message}
        required
      >
        <Select
          {...register("status")}
          options={statusOptions}
          id="status"
          placeholder="Select job status"
          error={!!errors.status}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          id="start_date"
          label="Start Date"
          error={errors.start_date?.message}
          required
        >
          <DatePicker
            {...register("start_date")}
            id="start_date"
            error={!!errors.start_date}
          />
        </FormField>

        <FormField
          id="end_date"
          label="End Date"
          error={errors.end_date?.message}
          required
        >
          <DatePicker
            {...register("end_date")}
            id="end_date"
            error={!!errors.end_date}
          />
        </FormField>
      </div>

      <FormField
        id="clientId"
        label="Client"
        error={errors.clientId?.message}
        required
      >
        <Select
          {...register("clientId")}
          options={clientOptions}
          id="clientId"
          placeholder="Select client"
          error={!!errors.clientId}
          defaultValue={clientId}
        />
      </FormField>

      <div className="flex justify-end gap-4">
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  )
}

interface EditJobFormProps {
  job: Job
}

export function EditJobForm({ job }: EditJobFormProps) {
  const router = useRouter()

  const handleSubmit = async (data: JobFormData) => {
    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update job")
      }

      router.refresh()
      router.push("/jobs")
    } catch (error) {
      console.error("Error updating job:", error)
    }
  }

  // Convert dates to string format for the form
  const formattedValues = {
    ...job,
    start_date: job.start_date instanceof Date 
      ? job.start_date.toISOString().slice(0, 16)
      : job.start_date,
    end_date: job.end_date instanceof Date 
      ? job.end_date.toISOString().slice(0, 16)
      : job.end_date,
    clientId: job.client?.id || MOCK_CLIENTS[0].id,
  }

  return <JobForm defaultValues={formattedValues} onSubmit={handleSubmit} />
}

export function NewJobForm() {
  const router = useRouter()

  const handleSubmit = async (data: JobFormData) => {
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create job")
      }

      router.refresh()
      router.push("/jobs")
    } catch (error) {
      console.error("Error creating job:", error)
    }
  }

  return <JobForm onSubmit={handleSubmit} />
}
