import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { CreateRateInput, SystemRateInput } from "@/types/rate";

interface RateFormProps {
  initialData?: CreateRateInput;
  onSubmit: (data: CreateRateInput | SystemRateInput) => void;
  isSubmitting?: boolean;
  isSystemRate?: boolean;
}

type FormValues = {
  name: string;
  description: string;
  value: string | number;
};

export default function RateForm({ initialData, onSubmit, isSubmitting, isSystemRate }: RateFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().min(1, "Description is required"),
        value: z.union([
          z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid percentage format"),
          z.number().min(0, "Value must be positive").max(100, "Value cannot exceed 100")
        ]).transform(val => typeof val === 'string' ? parseFloat(val) : val)
      }).superRefine((data, ctx) => {
        // Skip validation for name/description if it's a system rate
        if (!isSystemRate) {
          if (!data.name) {
            ctx.addIssue({ code: 'custom', path: ['name'], message: 'Name is required' });
          }
          if (!data.description) {
            ctx.addIssue({ code: 'custom', path: ['description'], message: 'Description is required' });
          }
        }
      })
    ),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit((data) => {
      // Log submission data
      console.log('Form submission:', {
        isSystemRate,
        data
      });

      // For system rates, only submit the value
      if (isSystemRate) {
        onSubmit({ value: Number(data.value) });
      } else {
        onSubmit({
          name: data.name,
          description: data.description,
          value: Number(data.value)
        });
      }
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
          readOnly={isSystemRate}
          className={isSystemRate ? "bg-gray-100" : ""}
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
          readOnly={isSystemRate}
          className={isSystemRate ? "bg-gray-100" : ""}
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
