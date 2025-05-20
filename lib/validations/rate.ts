import { z } from "zod";

const rateValueSchema = z.union([
  z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid percentage format"),
  z.number().min(0, "Percentage must be a non-negative number").max(100, "Percentage cannot exceed 100")
]).transform(val => typeof val === 'string' ? parseFloat(val) : val);

export const createRateSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .refine(name => name !== 'Company Profit Margin', 'Cannot create a rate with this name as it is reserved for system use'),
  description: z.string().min(1, "Description is required"),
  value: rateValueSchema,
});

export const updateRateSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .optional(),
  description: z.string()
    .min(1, "Description is required")
    .optional(),
  value: rateValueSchema.optional(),
});

// Special schema for system rates that only validates value
export const systemRateSchema = z.object({
  value: rateValueSchema,
}).strict(); // Only allow value field

export const isSystemRate = (name: string) => name === 'Company Profit Margin';

export type CreateRateInput = z.infer<typeof createRateSchema>;
export type UpdateRateInput = z.infer<typeof updateRateSchema>;
export type SystemRateInput = z.infer<typeof systemRateSchema>;
