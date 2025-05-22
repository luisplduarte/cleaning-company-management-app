"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { JobFormData, JobType, JobStatus, jobFormSchema } from "../utils/job"
import type { SelectOption } from "@/components/ui/elements/select/types"
import type { Job } from "@/app/(authenticated)/jobs/types"
import { Button } from "@/components/ui/elements/button/Button"
import { Input } from "@/components/ui/elements/input/Input"
import { Select } from "@/components/ui/elements/select/Select"
import { Textarea } from "@/components/ui/elements/textarea/Textarea"
import { DatePicker } from "@/components/ui/molecules/date-picker/DatePicker"
import { FormField } from "@/components/ui/molecules/form-field/FormField"
import { Spinner } from "@/components/ui/elements/spinner/Spinner"

interface JobFormProps {
  defaultValues?: Partial<JobFormData>
  onSubmit: (data: JobFormData) => void | Promise<void>
  isSubmitting?: boolean
}

const typeOptions: SelectOption[] = Object.entries(JobType).map(([value, label]) => ({
  value,
  label: label as string,
}))

const statusOptions: SelectOption[] = Object.entries(JobStatus).map(([value, label]) => ({
  value,
  label: label as string,
}))

const initialValues: JobFormData = {
  title: "",
  description: "",
  location: "",
  type: JobType.RESIDENTIAL,
  status: JobStatus.PENDING,
  start_date: "",
  end_date: "",
  clientId: "",
  workerId: "",
}

export function JobForm({ defaultValues, onSubmit, isSubmitting = false }: JobFormProps) {
  const router = useRouter()
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [workers, setWorkers] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, workersRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/workers')
        ]);

        if (!clientsRes.ok || !workersRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [clientsData, workersData] = await Promise.all([
          clientsRes.json(),
          workersRes.json()
        ]);

        setClients(clientsData);
        setWorkers(workersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const clientOptions: SelectOption[] = clients.map(client => ({
    value: client.id,
    label: client.name,
  }));

  const workerOptions: SelectOption[] = workers.map(worker => ({
    value: worker.id,
    label: worker.name,
  }));

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: defaultValues || initialValues,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

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

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      ) : (
        <>
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
              placeholder="Select client..."
              error={!!errors.clientId}
              disabled={isLoading}
            />
          </FormField>

          <FormField
            id="workerId"
            label="Worker"
            error={errors.workerId?.message}
            required
          >
            <Select
              {...register("workerId")}
              options={workerOptions}
              id="workerId"
              placeholder="Select worker..."
              error={!!errors.workerId}
              disabled={isLoading}
            />
          </FormField>
        </>
      )}

      <div className="flex justify-end gap-4">
        <Button 
          type="button"
          variant="secondary"
          onClick={() => router.push("/jobs")}
        >
          Cancel
        </Button>
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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: JobFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update job");
      }

      router.refresh();
      router.push("/jobs");
    } catch (error) {
      console.error("Error updating job:", error);
      setError(error instanceof Error ? error.message : "Failed to update job");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Format values for the form, preserving local timezone
  const formattedValues = {
    ...job,
    start_date: typeof job.start_date === 'string' 
      ? job.start_date.slice(0, 16) // Remove seconds and timezone
      : new Date(job.start_date).toLocaleString('sv').replace(' ', 'T').slice(0, 16),
    end_date: typeof job.end_date === 'string'
      ? job.end_date.slice(0, 16) // Remove seconds and timezone
      : new Date(job.end_date).toLocaleString('sv').replace(' ', 'T').slice(0, 16),
    clientId: job.client?.id || "",
    workerId: job.assignments?.[0]?.worker?.id || "",
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      <JobForm 
        defaultValues={formattedValues} 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export function NewJobForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: JobFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create job");
      }

      router.refresh();
      router.push("/jobs");
    } catch (error) {
      console.error("Error creating job:", error);
      setError(error instanceof Error ? error.message : "Failed to create job");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      <JobForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
