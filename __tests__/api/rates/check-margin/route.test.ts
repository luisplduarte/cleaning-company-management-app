import { prisma } from "@/lib/prisma";
import { GET } from "@/app/api/rates/check-margin/route";

// Mock console.error to avoid noisy test output
const originalError = console.error;
jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    rate: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("Rate Margin API", () => {
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
    it("returns existing profit margin rate if found", async () => {
      const mockRate = {
        id: "1",
        name: "Company Profit Margin",
        value: 0.3,
        description: "Default company profit margin applied to worker payments to calculate client payments",
        is_system: true,
        created_at: mockDate,
        updated_at: mockDate,
      };

      const expectedResponse = {
        ...mockRate,
        created_at: mockDate.toISOString(),
        updated_at: mockDate.toISOString(),
      };

      (prisma.rate.findFirst as jest.Mock).mockResolvedValueOnce(mockRate);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(expectedResponse);
      expect(prisma.rate.findFirst).toHaveBeenCalledWith({
        where: { name: "Company Profit Margin" },
      });
      expect(prisma.rate.create).not.toHaveBeenCalled();
    });

    it("creates default profit margin rate if none exists", async () => {
      (prisma.rate.findFirst as jest.Mock).mockResolvedValueOnce(null);

      const mockCreatedRate = {
        id: "1",
        name: "Company Profit Margin",
        value: 0.3,
        description: "Default company profit margin applied to worker payments to calculate client payments",
        is_system: true,
        created_at: mockDate,
        updated_at: mockDate,
      };

      const expectedResponse = {
        ...mockCreatedRate,
        created_at: mockDate.toISOString(),
        updated_at: mockDate.toISOString(),
      };

      (prisma.rate.create as jest.Mock).mockResolvedValueOnce(mockCreatedRate);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(expectedResponse);
      expect(prisma.rate.create).toHaveBeenCalledWith({
        data: {
          name: "Company Profit Margin",
          description: "Default company profit margin applied to worker payments to calculate client payments",
          value: 0.3,
          is_system: true,
        },
      });
    });

    it("handles database errors gracefully", async () => {
      (prisma.rate.findFirst as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const response = await GET();

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Internal Server Error");
    });

    it("handles creation failure gracefully", async () => {
      (prisma.rate.findFirst as jest.Mock).mockResolvedValueOnce(null);
      (prisma.rate.create as jest.Mock).mockResolvedValueOnce(null);

      const response = await GET();

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Internal Server Error");
    });
  });
});
