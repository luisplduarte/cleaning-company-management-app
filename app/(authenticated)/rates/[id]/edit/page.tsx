"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { PageHeader } from "@/components/ui/PageHeader";
import RateForm from "@/components/rates/RateForm";
import type { CreateRateInput } from "@/types/rate";
import { Spinner } from "@/components/ui/Spinner";

interface Props {
  params: {
    id: string;
  };
}

export default function EditRatePage({ params }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rate, setRate] = useState<CreateRateInput | null>(null);

  useEffect(() => {
    async function loadRate() {
      try {
        const response = await fetch(`/api/rates/${params.id}`);
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
  }, [params.id]);

  async function handleSubmit(data: CreateRateInput) {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/rates/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update rate");
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
        />
      </div>
    </div>
  );
}
