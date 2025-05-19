import { z } from "zod";
import { PaymentStatus } from "@prisma/client";

export const paymentUpdateSchema = z.object({
  status: z.enum(Object.values(PaymentStatus) as [PaymentStatus, ...PaymentStatus[]]),
});

export type PaymentUpdateInput = z.infer<typeof paymentUpdateSchema>;
