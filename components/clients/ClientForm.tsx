"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

import { ClientFormData } from "@/types/client";
import { createClientSchema } from "@/lib/validations/client";

import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ClientFormProps {
  initialData?: ClientFormData;
  clientId?: string;
  mode: "create" | "edit";
}

export function ClientForm({ initialData, clientId, mode }: ClientFormProps) {
  const router = useRouter();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      country: "",
      town: "",
      zipCode: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: ClientFormData) {
    try {
      if (mode === "create") {
        const response = await fetch("/api/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to create client");
        }

        toast({
          title: "Success",
          message: "Client created successfully",
          type: "success"
        });
        router.push("/clients");
        router.refresh();
      } else {
        const response = await fetch(`/api/clients/${clientId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update client");
        }

        toast({
          title: "Success",
          message: "Client updated successfully",
          type: "success"
        });
        router.push("/clients");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        message: "Something went wrong",
        type: "error"
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        id="name"
        label="Name"
        error={form.formState.errors.name?.message}
        required
      >
        <Input
          {...form.register("name")}
          placeholder="Enter client name"
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        id="email"
        label="Email"
        error={form.formState.errors.email?.message}
        required
      >
        <Input
          {...form.register("email")}
          type="email"
          placeholder="Enter client email"
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        id="phone"
        label="Phone"
        error={form.formState.errors.phone?.message}
        required
      >
        <Input
          {...form.register("phone")}
          type="tel"
          placeholder="Enter client phone number"
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        id="country"
        label="Country"
        error={form.formState.errors.country?.message}
        required
      >
        <Input
          {...form.register("country")}
          placeholder="Enter country"
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        id="town"
        label="Town"
        error={form.formState.errors.town?.message}
        required
      >
        <Input
          {...form.register("town")}
          placeholder="Enter town"
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        id="zipCode"
        label="ZIP Code"
        error={form.formState.errors.zipCode?.message}
        required
      >
        <Input
          {...form.register("zipCode")}
          placeholder="Enter ZIP code"
          disabled={isSubmitting}
        />
      </FormField>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {mode === "create" ? "Create" : "Update"} Client
        </Button>
      </div>
    </form>
  );
}
