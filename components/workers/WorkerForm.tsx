import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { WorkerFormData } from "@/types/worker";
import { createWorkerSchema } from "@/lib/validations/worker";

interface WorkerFormProps {
  initialData?: WorkerFormData;
  onSubmit: (data: WorkerFormData) => void;
  isSubmitting?: boolean;
}

export default function WorkerForm({ initialData, onSubmit, isSubmitting }: WorkerFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkerFormData>({
    resolver: zodResolver(createWorkerSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <FormField
        id="name"
        label="Name"
        error={errors.name?.message}
      >
        <Input
          id="name"
          placeholder="Enter worker name"
          {...register("name")}
        />
      </FormField>

      <FormField
        id="email"
        label="Email"
        error={errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          placeholder="Enter email address"
          {...register("email")}
        />
      </FormField>

      <FormField
        id="phone"
        label="Phone"
        error={errors.phone?.message}
      >
        <Input
          id="phone"
          type="tel"
          placeholder="Enter phone number"
          {...register("phone")}
        />
      </FormField>

      <FormField
        id="country"
        label="Country"
        error={errors.country?.message}
      >
        <Input
          id="country"
          placeholder="Enter country"
          {...register("country")}
        />
      </FormField>

      <FormField
        id="town"
        label="Town"
        error={errors.town?.message}
      >
        <Input
          id="town"
          placeholder="Enter town"
          {...register("town")}
        />
      </FormField>

      <FormField
        id="zipCode"
        label="ZIP Code"
        error={errors.zipCode?.message}
      >
        <Input
          id="zipCode"
          placeholder="Enter ZIP code"
          {...register("zipCode")}
        />
      </FormField>

      <FormField
        id="hourly_rate"
        label="Hourly Rate"
        error={errors.hourly_rate?.message}
      >
        <Input
          id="hourly_rate"
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter hourly rate"
          {...register("hourly_rate")}
        />
      </FormField>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/workers")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Worker"}
        </Button>
      </div>
    </form>
  );
}
