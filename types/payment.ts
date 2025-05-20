import { PaymentStatus } from "@prisma/client";
export type { PaymentStatus };

export type WorkerPayment = {
  id: string;
  worker_id: string;
  job_id: string;
  amount: number;
  status: PaymentStatus;
  payment_date: Date | null;
  created_at: Date;
  updated_at: Date;
  worker: {
    id: string;
    name: string;
  };
  job: {
    id: string;
    title: string;
    start_date: Date;
    end_date: Date;
  };
}

export type ClientPayment = {
  id: string;
  client_id: string;
  job_id: string;
  amount: number;
  status: PaymentStatus;
  payment_date: Date | null;
  created_at: Date;
  updated_at: Date;
  client: {
    id: string;
    name: string;
  };
  job: {
    id: string;
    title: string;
    start_date: Date;
    end_date: Date;
  };
}

export interface PaymentUpdateData {
  status: PaymentStatus;
}
