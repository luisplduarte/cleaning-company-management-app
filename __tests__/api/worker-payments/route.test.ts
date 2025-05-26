import { prisma } from "@/lib/prisma";
import { GET } from "@/app/api/worker-payments/route";
import { WorkerPayment } from "@/types/payment";
import { PaymentStatus } from "@prisma/client";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    workerPayment: {
      findMany: jest.fn(),
    },
  },
}));

describe("Worker Payments API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockDate = new Date("2025-05-26T08:05:49.065Z");
  const mockOlderDate = new Date("2025-05-25T08:05:49.065Z");

  describe("GET", () => {
    it("returns all worker payments in descending order by creation date", async () => {
      const mockPayments: WorkerPayment[] = [
        {
          id: "1",
          worker_id: "worker1",
          job_id: "job1",
          amount: 800,
          status: PaymentStatus.WAITING_PAYMENT,
          payment_date: null,
          created_at: mockDate,
          updated_at: mockDate,
          worker: {
            id: "worker1",
            name: "Worker A",
          },
          job: {
            id: "job1",
            title: "Job A",
            start_date: mockDate,
            end_date: new Date(mockDate.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        {
          id: "2",
          worker_id: "worker2",
          job_id: "job2",
          amount: 1200,
          status: PaymentStatus.COMPLETED,
          payment_date: mockDate,
          created_at: mockOlderDate,
          updated_at: mockDate,
          worker: {
            id: "worker2",
            name: "Worker B",
          },
          job: {
            id: "job2",
            title: "Job B",
            start_date: mockDate,
            end_date: new Date(mockDate.getTime() + 48 * 60 * 60 * 1000),
          },
        },
      ];

      (prisma.workerPayment.findMany as jest.Mock).mockResolvedValueOnce(mockPayments);

      const response = await GET();
      const data = await response.json();

      // Convert date strings to Date objects for comparison
      const parsedData = data.map((payment: Omit<WorkerPayment, 'created_at' | 'updated_at' | 'payment_date' | 'job'> & {
        created_at: string;
        updated_at: string;
        payment_date: string | null;
        job: {
          id: string;
          title: string;
          start_date: string;
          end_date: string;
        };
      }) => ({
        ...payment,
        created_at: new Date(payment.created_at),
        updated_at: new Date(payment.updated_at),
        payment_date: payment.payment_date ? new Date(payment.payment_date) : null,
        job: {
          ...payment.job,
          start_date: new Date(payment.job.start_date),
          end_date: new Date(payment.job.end_date),
        },
      }));

      expect(response.status).toBe(200);
      expect(parsedData).toEqual(mockPayments);
      expect(prisma.workerPayment.findMany).toHaveBeenCalledWith({
        include: {
          worker: {
            select: {
              id: true,
              name: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              start_date: true,
              end_date: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });
    });

    it("returns empty array when no payments exist", async () => {
      (prisma.workerPayment.findMany as jest.Mock).mockResolvedValueOnce([]);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it("handles database errors gracefully", async () => {
      (prisma.workerPayment.findMany as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const response = await GET();

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Internal Server Error");
    });
  });
});
