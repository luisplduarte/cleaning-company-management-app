import { z } from "zod";
import { createWorkerSchema } from "@/lib/validations/worker";

export type WorkerResponse = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  town: string;
  zipCode: string;
  hourly_rate: number;
};

export type WorkerFormData = z.infer<typeof createWorkerSchema>;

export type WorkerTableItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  town: string;
  zipCode: string;
  hourly_rate: number;
};
