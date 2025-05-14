import { z } from "zod";

export const createWorkerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  town: z.string().min(1, "Town is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
});

export const updateWorkerSchema = createWorkerSchema;

export type CreateWorkerInput = z.infer<typeof createWorkerSchema>;
export type UpdateWorkerInput = z.infer<typeof updateWorkerSchema>;
