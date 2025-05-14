"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/lib/toast";
import WorkerForm from "./WorkerForm";
import type { WorkerResponse, WorkerFormData } from "@/types/worker";

interface EditWorkerFormProps {
  worker: WorkerResponse;
}

export default function EditWorkerForm({ worker }: EditWorkerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: WorkerFormData) {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/workers/${worker.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      toast({
        title: "Success",
        message: "Worker updated successfully",
        type: "success"
      });
      router.push(`/workers/${worker.id}`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        message: "Error updating worker",
        type: "error"
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <WorkerForm
      initialData={worker}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
