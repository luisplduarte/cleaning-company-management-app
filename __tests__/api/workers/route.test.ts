import { prisma } from "@/lib/prisma";
import { GET, POST } from "@/app/api/workers/route";
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
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock console.error to avoid noisy test output
const originalError = console.error;
jest.spyOn(console, 'error').mockImplementation(() => {});

describe("Workers API", () => {
  const mockDate = new Date("2025-05-26T08:05:49.065Z");

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
    it("returns all workers sorted by name", async () => {
      const mockWorkers = [
        {
          id: "1",
          name: "Alice Worker",
          email: "alice@example.com",
          phone: "123456789",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "1000-100",
          hourly_rate: 15.5,
          created_at: mockDate,
          updated_at: mockDate,
        },
        {
          id: "2",
          name: "Bob Worker",
          email: "bob@example.com",
          phone: "987654321",
          country: "Portugal",
          town: "Porto",
          zipCode: "4000-100",
          hourly_rate: 16.0,
          created_at: mockDate,
          updated_at: mockDate,
        },
      ];

      const expectedResponse = mockWorkers.map(worker => ({
        ...worker,
        created_at: worker.created_at.toISOString(),
        updated_at: worker.updated_at.toISOString(),
      }));

      (prisma.worker.findMany as jest.Mock).mockResolvedValueOnce(mockWorkers);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(expectedResponse);
      expect(prisma.worker.findMany).toHaveBeenCalledWith({
        orderBy: { name: "asc" },
      });
    });

    it("handles database errors gracefully", async () => {
      (prisma.worker.findMany as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const response = await GET();

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Internal server error");
    });
  });

  describe("POST", () => {
    it("creates a new worker with valid data", async () => {
      const mockWorker = {
        id: "1",
        name: "New Worker",
        email: "new@example.com",
        phone: "123456789",
        country: "Portugal",
        town: "Lisbon",
        zipCode: "1000-100",
        hourly_rate: 15.5,
        created_at: mockDate,
        updated_at: mockDate,
      };

      const expectedResponse = {
        ...mockWorker,
        created_at: mockWorker.created_at.toISOString(),
        updated_at: mockWorker.updated_at.toISOString(),
      };

      const requestBody = {
        name: "New Worker",
        email: "new@example.com",
        phone: "123456789",
        country: "Portugal",
        town: "Lisbon",
        zipCode: "1000-100",
        hourly_rate: "15.50",
      };

      (prisma.worker.create as jest.Mock).mockResolvedValueOnce(mockWorker);

      const request = new NextRequest("http://localhost:3000/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(expectedResponse);
      expect(prisma.worker.create).toHaveBeenCalledWith({
        data: {
          ...requestBody,
          hourly_rate: 15.5,
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/workers");
    });

    it("validates required fields", async () => {
      const requestBody = {
        // Missing required fields
        name: "New Worker",
        email: "invalid-email",
      };

      const request = new NextRequest("http://localhost:3000/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Invalid request");
      expect(prisma.worker.create).not.toHaveBeenCalled();
    });

    it("handles database errors gracefully", async () => {
      const requestBody = {
        name: "New Worker",
        email: "new@example.com",
        phone: "123456789",
        country: "Portugal",
        town: "Lisbon",
        zipCode: "1000-100",
        hourly_rate: 15.5,
      };

      (prisma.worker.create as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const request = new NextRequest("http://localhost:3000/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Invalid request");
    });
  });
});
