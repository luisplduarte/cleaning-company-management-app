import { z } from "zod";

export const createWorkerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  town: z.string().min(1, "Town is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  hourly_rate: z.union([
    z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid rate format"),
    z.number().nonnegative("Rate must be a non-negative number")
  ]).transform(val => typeof val === 'string' ? parseFloat(val) : val),
});

export const updateWorkerSchema = createWorkerSchema;

export type CreateWorkerInput = z.infer<typeof createWorkerSchema>;
export type UpdateWorkerInput = z.infer<typeof updateWorkerSchema>;
