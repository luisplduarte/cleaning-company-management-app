import { z } from "zod";
import { PaymentStatus } from "@prisma/client";

export const updatePaymentStatusSchema = z.object({
  status: z.nativeEnum(PaymentStatus),
});

export const createPaymentSchema = z.object({
  amount: z.number().positive(),
  job_id: z.string().min(1, "Job ID is required"),
  status: z.nativeEnum(PaymentStatus).default("WAITING_PAYMENT"),
});
