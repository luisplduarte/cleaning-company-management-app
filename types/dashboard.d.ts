import { JobType, JobStatus, PaymentStatus } from "@prisma/client";

export interface DashboardData {
  jobsByType: {
    type: JobType;
    count: number;
  }[];
  paymentStatus: {
    client: {
      status: PaymentStatus;
      amount: number;
    }[];
    worker: {
      status: PaymentStatus;
      amount: number;
    }[];
  };
  workerEfficiency: {
    name: string;
    totalJobs: number;
    completedJobs: number;
  }[];
  revenueByMonth: {
    date: Date;
    amount: number;
  }[];
}

export interface ChartProps {
  data: {
    [K in keyof DashboardData]: DashboardData[K] extends Array<infer U> ? U[] : never;
  }[keyof DashboardData];
}
