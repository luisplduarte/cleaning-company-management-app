import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GET, POST } from "@/app/api/rates/route";
import { CreateRateInput, Rate } from "@/app/(authenticated)/rates/types";
import { z } from "zod";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    rate: {
      findMany: jest.fn(),
      create: jest.fn(({ data }) => ({
        ...data,
        id: "1",
        created_at: new Date("2025-05-26T08:05:49.065Z"),
        updated_at: new Date("2025-05-26T08:05:49.065Z"),
      })),
    },
  },
}));

// Mock next/cache
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// Mock rate validation
jest.mock("@/lib/validations/rate", () => ({
  createRateSchema: {
    parse: jest.fn().mockImplementation((data) => {
      if (!data.name || !data.value) {
        throw new z.ZodError([
          {
            code: z.ZodIssueCode.invalid_type,
            expected: "string",
            received: "undefined",
            path: ["name"],
            message: "Required",
          },
        ]);
      }
      return data;
    }),
  },
}));

describe("Rates API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockDate = new Date("2025-05-26T08:05:49.065Z");

  describe("GET", () => {
    it("returns all rates in ascending order by name", async () => {
      const mockRates: Rate[] = [
        { 
          id: "1", 
          name: "Rate A", 
          description: "Description A", 
          value: 10,
          created_at: mockDate,
          updated_at: mockDate
        },
        { 
          id: "2", 
          name: "Rate B", 
          description: "Description B", 
          value: 20,
          created_at: mockDate,
          updated_at: mockDate
        },
      ];

      (prisma.rate.findMany as jest.Mock).mockResolvedValueOnce(mockRates);

      const response = await GET();
      const data = await response.json();

      // Convert date strings to Date objects for comparison
      const parsedData = data.map((rate: Omit<Rate, 'created_at' | 'updated_at'> & {
        created_at: string;
        updated_at: string;
      }) => ({
        ...rate,
        created_at: new Date(rate.created_at),
        updated_at: new Date(rate.updated_at),
      }));

      expect(response.status).toBe(200);
      expect(parsedData).toEqual(mockRates);
      expect(prisma.rate.findMany).toHaveBeenCalledWith({
        orderBy: { name: "asc" },
      });
    });

    it("returns empty array when no rates exist", async () => {
      (prisma.rate.findMany as jest.Mock).mockResolvedValueOnce([]);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it("handles database errors gracefully", async () => {
      (prisma.rate.findMany as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const response = await GET();

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Internal server error");
    });
  });

  describe("POST", () => {
    const mockRequest = (body: Partial<CreateRateInput>) =>
      new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify(body),
      });

    it("creates a new rate with valid data", async () => {
      const mockRate: Rate = {
        id: "1",
        name: "Test Rate",
        description: "Test Description",
        value: 10,
        created_at: mockDate,
        updated_at: mockDate
      };

      const request = mockRequest({
        name: "Test Rate",
        description: "Test Description",
        value: 10,
      });

      const response = await POST(request);
      const data = await response.json();

      // Convert date strings back to Date objects for comparison
      const parsedData = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };

      expect(response.status).toBe(200);
      expect(parsedData).toEqual(mockRate);
      expect(prisma.rate.create).toHaveBeenCalledWith({
        data: {
          name: "Test Rate",
          description: "Test Description",
          value: 10,
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/rates");
    });

    it("handles invalid data formats", async () => {
      const request = mockRequest({
        description: "Missing name and value"
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Invalid request");
    });

    it("handles database errors gracefully", async () => {
      (prisma.rate.create as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const request = mockRequest({
        name: "Test Rate",
        description: "Test Description",
        value: 10,
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Invalid request");
    });
  });
});
