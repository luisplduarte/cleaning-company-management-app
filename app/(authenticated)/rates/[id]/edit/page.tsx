"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { PageHeader } from "@/components/ui/organisms/page-header/PageHeader";
import RateForm from "../../components/RateForm";
import type { CreateRateInput, SystemRateInput } from "../../types";
import { Spinner } from "@/components/ui/elements/spinner/Spinner";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function EditRatePage({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rate, setRate] = useState<(CreateRateInput & { is_system?: boolean }) | null>(null);

  useEffect(() => {
    async function loadRate() {
      try {
        const response = await fetch(`/api/rates/${id}`);
        if (!response.ok) {
          throw new Error("Failed to load rate");
        }
        const data = await response.json();
        setRate(data);
      } catch (error) {
        toast({
          title: "Error",
          message: "Error loading rate",
          type: "error"
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadRate();
  }, [id]);

  async function handleSubmit(data: CreateRateInput | SystemRateInput) {
    try {
      setIsSubmitting(true);

      let endpoint = `/api/rates/${id}`;
      if (rate?.is_system) {
        // Use system rate endpoint for system rates
        endpoint = `/api/rates/system/profit-margin`;
      }

      const response = await fetch(endpoint, {
        method: rate?.is_system ? "PATCH" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update rate");
      }

      toast({
        title: "Success",
        message: "Rate updated successfully",
        type: "success"
      });
      router.push("/rates");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        message: "Error updating rate",
        type: "error"
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!rate) {
    return <div>Rate not found</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <PageHeader
        title="Edit Rate"
        description="Update your rate settings"
      />
      <div className="mt-8">
        <RateForm 
          initialData={rate} 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isSystemRate={rate.is_system}
        />
      </div>
    </div>
  );
}
