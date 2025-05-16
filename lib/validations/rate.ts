import { z } from "zod";

export const createRateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  value: z.union([
    z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid percentage format"),
    z.number().min(0, "Percentage must be a non-negative number").max(100, "Percentage cannot exceed 100")
  ]).transform(val => typeof val === 'string' ? parseFloat(val) : val),
});

export const updateRateSchema = createRateSchema;

export type CreateRateInput = z.infer<typeof createRateSchema>;
export type UpdateRateInput = z.infer<typeof updateRateSchema>;
