import { z } from "zod";
import { createWorkerSchema } from "@/lib/validations/worker";

export type WorkerRateHistoryItem = {
  id: string;
  worker_id: string;
  old_rate: number;
  new_rate: number;
  changed_at: string;
};

export type WorkerResponse = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  town: string;
  zipCode: string;
  hourly_rate: number;
  rate_history?: WorkerRateHistoryItem[];
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
