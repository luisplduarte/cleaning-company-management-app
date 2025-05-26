import { prisma } from "@/lib/prisma";
import { Rate } from "@/app/(authenticated)/rates/types";
import { GET } from "@/app/api/rates/check-margin/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    rate: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("Rate Margin API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    const mockDate = new Date("2025-05-26T08:05:49.065Z");
    
    it("returns existing profit margin rate", async () => {
      const mockRate: Rate = {
        id: "1",
        name: "Company Profit Margin",
        description: "Default company profit margin applied to worker payments to calculate client payments",
        value: 0.3,
        created_at: mockDate,
        updated_at: mockDate
      };

      (prisma.rate.findFirst as jest.Mock).mockResolvedValueOnce({
        ...mockRate,
        created_at: mockDate,
        updated_at: mockDate,
      });

      const response = await GET();
      const data = await response.json();
      
      // Convert date strings to Date objects for comparison
      const parsedData = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };

      expect(response.status).toBe(200);
      expect(parsedData).toEqual(mockRate);
      expect(prisma.rate.findFirst).toHaveBeenCalledWith({
        where: { name: "Company Profit Margin" },
      });
      expect(prisma.rate.create).not.toHaveBeenCalled();
    });

    it("creates default profit margin rate if none exists", async () => {
      const mockRate: Rate = {
        id: "1",
        name: "Company Profit Margin",
        description: "Default company profit margin applied to worker payments to calculate client payments",
        value: 0.3,
        created_at: mockDate,
        updated_at: mockDate
      };

      (prisma.rate.findFirst as jest.Mock).mockResolvedValueOnce(null);
      (prisma.rate.create as jest.Mock).mockResolvedValueOnce({
        ...mockRate,
        created_at: mockDate,
        updated_at: mockDate,
      });

      const response = await GET();
      const data = await response.json();

      // Convert date strings to Date objects for comparison
      const parsedData = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };

      expect(response.status).toBe(200);
      expect(parsedData).toEqual(mockRate);
      expect(prisma.rate.findFirst).toHaveBeenCalledWith({
        where: { name: "Company Profit Margin" },
      });
      expect(prisma.rate.create).toHaveBeenCalledWith({
        data: {
          name: "Company Profit Margin",
          description: "Default company profit margin applied to worker payments to calculate client payments",
          value: 0.3,
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
  });
});
