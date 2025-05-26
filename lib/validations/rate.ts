import { z } from "zod";

export const createRateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  value: z.number().min(0, "Value must be positive"),
});

export type CreateRateSchema = z.infer<typeof createRateSchema>;
