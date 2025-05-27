import { prisma } from "@/lib/prisma";
import { PATCH } from "@/app/api/client-payments/[id]/route";
import { PaymentStatus } from "@prisma/client";
import { NextRequest } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";

// Mock console.error to avoid noisy test output
const originalError = console.error;
jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    clientPayment: {
      update: jest.fn(),
    },
  },
}));

describe("Client Payment [id] API", () => {
  const mockDate = new Date("2025-05-26T08:05:49.065Z");
  const mockParams = { params: { id: "test-id" } };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    console.error = originalError;
  });

  describe("PATCH", () => {
    it("updates payment status and sets payment date for completed status", async () => {
      const mockPayment = {
        id: "test-id",
        amount: new Decimal(500),
        status: PaymentStatus.COMPLETED,
        payment_date: mockDate,
        client_id: "client-1",
        job_id: "job-1",
        created_at: mockDate,
        updated_at: mockDate,
        client: {
          id: "client-1",
          name: "Test Client",
        },
        job: {
          id: "job-1",
          title: "Test Job",
          start_date: mockDate,
          end_date: new Date(mockDate.getTime() + 3600000),
        },
      };

      const expectedResponse = {
        ...mockPayment,
        amount: parseFloat(mockPayment.amount.toString()),
        payment_date: mockDate.toISOString(),
        created_at: mockDate.toISOString(),
        updated_at: mockDate.toISOString(),
        job: {
          ...mockPayment.job,
          start_date: mockPayment.job.start_date.toISOString(),
          end_date: mockPayment.job.end_date.toISOString(),
        },
      };

      (prisma.clientPayment.update as jest.Mock).mockResolvedValueOnce(mockPayment);

      const request = new NextRequest("http://test.com", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: PaymentStatus.COMPLETED }),
      });

      const response = await PATCH(request, mockParams);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(expectedResponse);
    });

    it("handles validation errors with 400 status", async () => {
      const request = new NextRequest("http://test.com", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "INVALID" }),
      });

      const response = await PATCH(request, mockParams);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Invalid payment status" });
    });

    it("handles database errors gracefully", async () => {
      (prisma.clientPayment.update as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const request = new NextRequest("http://test.com", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: PaymentStatus.COMPLETED }),
      });

      const response = await PATCH(request, mockParams);

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Internal Server Error");
    });
  });
});
