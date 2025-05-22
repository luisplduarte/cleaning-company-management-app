"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";
import RateForm from "../components/RateForm";
import type { CreateRateInput } from "../types";

export default function NewRatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data: CreateRateInput) {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create rate");
      }

      toast({
        title: "Success",
        message: "Rate created successfully",
        type: "success"
      });
      router.push("/rates");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        message: "Error creating rate",
        type: "error"
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <PageHeader
        title="New Rate"
        description="Create a new rate for your company"
      />
      <div className="mt-8">
        <RateForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
