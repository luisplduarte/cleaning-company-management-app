import { prisma } from "@/lib/prisma";
import { PATCH } from "@/app/api/client-payments/[id]/route";
import { ClientPayment, PaymentUpdateData } from "@/types/payment";
import { PaymentStatus } from "@prisma/client";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    clientPayment: {
      update: jest.fn(),
    },
  },
}));

describe("Client Payment [ID] API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockDate = new Date("2025-05-26T08:05:49.065Z");
  const mockId = "test-payment-id";

  describe("PATCH", () => {
    const createRequest = (body: PaymentUpdateData) =>
      new Request("http://localhost", {
        method: "PATCH",
        body: JSON.stringify(body),
      });

    it("updates payment status to completed", async () => {
      const mockPayment: ClientPayment = {
        id: mockId,
        client_id: "client1",
        job_id: "job1",
        amount: 1000,
        status: PaymentStatus.COMPLETED,
        payment_date: mockDate,
        created_at: mockDate,
        updated_at: mockDate,
        client: {
          id: "client1",
          name: "Client A",
        },
        job: {
          id: "job1",
          title: "Job A",
          start_date: mockDate,
          end_date: new Date(mockDate.getTime() + 24 * 60 * 60 * 1000),
        },
      };

      (prisma.clientPayment.update as jest.Mock).mockResolvedValueOnce({
        ...mockPayment,
        created_at: mockDate,
        updated_at: mockDate,
        payment_date: mockDate,
        job: {
          ...mockPayment.job,
          start_date: mockDate,
          end_date: new Date(mockDate.getTime() + 24 * 60 * 60 * 1000),
        },
      });

      const request = createRequest({
        status: PaymentStatus.COMPLETED,
      });

      const response = await PATCH(request, { params: { id: mockId } });
      const data = await response.json();

      // Convert date strings to Date objects for comparison
      const parsedData = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        payment_date: data.payment_date ? new Date(data.payment_date) : null,
        job: {
          ...data.job,
          start_date: new Date(data.job.start_date),
          end_date: new Date(data.job.end_date),
        },
      };

      expect(response.status).toBe(200);
      expect(parsedData).toEqual(mockPayment);
      expect(prisma.clientPayment.update).toHaveBeenCalledWith({
        where: { id: mockId },
        data: {
          status: PaymentStatus.COMPLETED,
          payment_date: expect.any(Date),
        },
        include: {
          client: {
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
      });
    });

    it("updates payment status to waiting payment", async () => {
      const mockPayment: ClientPayment = {
        id: mockId,
        client_id: "client1",
        job_id: "job1",
        amount: 1000,
        status: PaymentStatus.WAITING_PAYMENT,
        payment_date: null,
        created_at: mockDate,
        updated_at: mockDate,
        client: {
          id: "client1",
          name: "Client A",
        },
        job: {
          id: "job1",
          title: "Job A",
          start_date: mockDate,
          end_date: new Date(mockDate.getTime() + 24 * 60 * 60 * 1000),
        },
      };

      (prisma.clientPayment.update as jest.Mock).mockResolvedValueOnce({
        ...mockPayment,
        created_at: mockDate,
        updated_at: mockDate,
        job: {
          ...mockPayment.job,
          start_date: mockDate,
          end_date: new Date(mockDate.getTime() + 24 * 60 * 60 * 1000),
        },
      });

      const request = createRequest({
        status: PaymentStatus.WAITING_PAYMENT,
      });

      const response = await PATCH(request, { params: { id: mockId } });
      const data = await response.json();

      // Convert date strings to Date objects for comparison
      const parsedData = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        payment_date: data.payment_date ? new Date(data.payment_date) : null,
        job: {
          ...data.job,
          start_date: new Date(data.job.start_date),
          end_date: new Date(data.job.end_date),
        },
      };

      expect(response.status).toBe(200);
      expect(parsedData).toEqual(mockPayment);
      expect(prisma.clientPayment.update).toHaveBeenCalledWith({
        where: { id: mockId },
        data: {
          status: PaymentStatus.WAITING_PAYMENT,
          payment_date: null,
        },
        include: {
          client: {
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
      });
    });

    it("handles invalid payment status", async () => {
      const request = createRequest({
        status: "INVALID_STATUS" as PaymentStatus,
      });

      const response = await PATCH(request, { params: { id: mockId } });

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Internal Server Error");
    });

    it("handles database errors gracefully", async () => {
      (prisma.clientPayment.update as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const request = createRequest({
        status: PaymentStatus.COMPLETED,
      });

      const response = await PATCH(request, { params: { id: mockId } });

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Internal Server Error");
    });
  });
});
