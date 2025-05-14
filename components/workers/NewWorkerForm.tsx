"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/lib/toast";
import WorkerForm from "./WorkerForm";
import type { WorkerFormData } from "@/types/worker";

export default function NewWorkerForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: WorkerFormData) {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const worker = await response.json();
      toast({
        title: "Success",
        message: "Worker created successfully",
        type: "success"
      });
      router.push(`/workers/${worker.id}`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        message: "Error creating worker",
        type: "error"
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return <WorkerForm onSubmit={onSubmit} isSubmitting={isSubmitting} />;
}
