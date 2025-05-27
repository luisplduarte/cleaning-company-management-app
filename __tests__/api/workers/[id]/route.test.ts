import { prisma } from "@/lib/prisma";
import { GET, PUT, DELETE } from "@/app/api/workers/[id]/route";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

// Mock next/cache
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    worker: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    workerRateHistory: {
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
  },
}));

// Mock console.error to avoid noisy test output
const originalError = console.error;
jest.spyOn(console, 'error').mockImplementation(() => {});

describe("Worker [id] API", () => {
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

  describe("GET", () => {
    it("returns worker with rate history if found", async () => {
      const mockWorker = {
        id: "test-id",
        name: "Test Worker",
        email: "test@example.com",
        phone: "123456789",
        country: "Portugal",
        town: "Lisbon",
        zipCode: "1000-100",
        hourly_rate: 15.5,
        created_at: mockDate,
        updated_at: mockDate,
        rate_history: [
          {
            id: "1",
            worker_id: "test-id",
            old_rate: 15.0,
            new_rate: 15.5,
            changed_at: mockDate,
          },
        ],
      };

      const expectedResponse = {
        ...mockWorker,
        created_at: mockWorker.created_at.toISOString(),
        updated_at: mockWorker.updated_at.toISOString(),
        rate_history: [
          {
            ...mockWorker.rate_history[0],
            changed_at: mockWorker.rate_history[0].changed_at.toISOString(),
          },
        ],
      };

      (prisma.worker.findUnique as jest.Mock).mockResolvedValueOnce(mockWorker);

      const request = new NextRequest("http://test.com");
      const response = await GET(request, mockParams);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(expectedResponse);
      expect(prisma.worker.findUnique).toHaveBeenCalledWith({
        where: { id: "test-id" },
        include: {
          rate_history: {
            orderBy: { changed_at: 'desc' }
          }
        }
      });
    });

    it("returns 404 if worker not found", async () => {
      (prisma.worker.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const request = new NextRequest("http://test.com");
      const response = await GET(request, mockParams);

      expect(response.status).toBe(404);
      expect(await response.text()).toBe("Worker not found");
    });

    it("handles database errors gracefully", async () => {
      (prisma.worker.findUnique as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const request = new NextRequest("http://test.com");
      const response = await GET(request, mockParams);

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Internal server error");
    });
  });

  describe("PUT", () => {
    it("updates worker and creates rate history when rate changes", async () => {
      const mockWorker = {
        id: "test-id",
        name: "Updated Worker",
        email: "updated@example.com",
        phone: "987654321",
        country: "Portugal",
        town: "Porto",
        zipCode: "4000-100",
        hourly_rate: 16.0,
        created_at: mockDate,
        updated_at: mockDate,
        rate_history: [],
      };

      const expectedResponse = {
        ...mockWorker,
        created_at: mockWorker.created_at.toISOString(),
        updated_at: mockWorker.updated_at.toISOString(),
        rate_history: mockWorker.rate_history,
      };

      (prisma.worker.findUnique as jest.Mock).mockResolvedValueOnce({
        hourly_rate: 15.0,
      });
      (prisma.worker.update as jest.Mock).mockResolvedValueOnce(mockWorker);
      (prisma.$transaction as jest.Mock).mockImplementationOnce((callback) => callback(prisma));

      const request = new NextRequest("http://test.com", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Updated Worker",
          email: "updated@example.com",
          phone: "987654321",
          country: "Portugal",
          town: "Porto",
          zipCode: "4000-100",
          hourly_rate: 16.0,
        }),
      });

      const response = await PUT(request, mockParams);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(expectedResponse);
      expect(prisma.workerRateHistory.create).toHaveBeenCalledWith({
        data: {
          worker_id: "test-id",
          old_rate: 15.0,
          new_rate: 16.0,
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/workers");
      expect(revalidatePath).toHaveBeenCalledWith("/workers/test-id");
    });

    it("returns 404 if worker not found", async () => {
      (prisma.worker.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const request = new NextRequest("http://test.com", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Updated Worker",
          email: "updated@example.com",
          phone: "987654321",
          country: "Portugal",
          town: "Porto",
          zipCode: "4000-100",
          hourly_rate: 16.0,
        }),
      });

      const response = await PUT(request, mockParams);

      expect(response.status).toBe(404);
      expect(await response.text()).toBe("Worker not found");
    });

    it("handles validation errors", async () => {
      const request = new NextRequest("http://test.com", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Updated Worker",
          email: "invalid-email", // Invalid email format
        }),
      });

      const response = await PUT(request, mockParams);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Invalid request");
    });
  });

  describe("DELETE", () => {
    it("deletes worker successfully", async () => {
      (prisma.worker.delete as jest.Mock).mockResolvedValueOnce({});

      const request = new NextRequest("http://test.com", {
        method: "DELETE",
      });

      const response = await DELETE(request, mockParams);

      expect(response.status).toBe(204);
      expect(prisma.worker.delete).toHaveBeenCalledWith({
        where: { id: "test-id" },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/workers");
    });

    it("handles database errors gracefully", async () => {
      (prisma.worker.delete as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const request = new NextRequest("http://test.com", {
        method: "DELETE",
      });

      const response = await DELETE(request, mockParams);

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Internal server error");
    });
  });
});
