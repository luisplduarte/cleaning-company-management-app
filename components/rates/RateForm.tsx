import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { CreateRateInput } from "@/types/rate";
import { createRateSchema } from "@/lib/validations/rate";

interface RateFormValues {
  name: string;
  description: string;
  value: string | number;
}

interface RateFormProps {
  initialData?: CreateRateInput;
  onSubmit: (data: CreateRateInput) => void;
  isSubmitting?: boolean;
}

export default function RateForm({ initialData, onSubmit, isSubmitting }: RateFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RateFormValues>({
    resolver: zodResolver(createRateSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit((data) => {
      onSubmit({
        ...data,
        value: Number(data.value)
      });
    })} className="space-y-4 max-w-xl">
      <FormField
        id="name"
        label="Name"
        error={errors.name?.message}
      >
        <Input
          id="name"
          placeholder="Enter rate name"
          {...register("name")}
        />
      </FormField>

      <FormField
        id="description"
        label="Description"
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          placeholder="Enter rate description"
          {...register("description")}
        />
      </FormField>

      <FormField
        id="value"
        label="Value (%)"
        error={errors.value?.message}
      >
        <Input
          id="value"
          type="number"
          step="0.01"
          min="0"
          max="100"
          placeholder="Enter percentage value"
          {...register("value")}
        />
      </FormField>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/rates")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Rate"}
        </Button>
      </div>
    </form>
  );
}
