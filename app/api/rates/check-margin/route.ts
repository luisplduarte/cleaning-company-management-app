import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if company profit margin rate exists
    let profitMarginRate = await prisma.rate.findFirst({
      where: { name: "Company Profit Margin" },
    });

    // If it doesn't exist, create it with a default value of 0.3 (30%)
    if (!profitMarginRate) {
      profitMarginRate = await prisma.rate.create({
        data: {
          name: "Company Profit Margin",
          description: "Default company profit margin applied to worker payments to calculate client payments",
          value: 0.3,
        },
      });
    }

    // Convert Date objects to ISO strings for JSON serialization
    const serializedRate = {
      ...profitMarginRate,
      created_at: profitMarginRate.created_at.toISOString(),
      updated_at: profitMarginRate.updated_at.toISOString(),
    };

    return NextResponse.json(serializedRate);
  } catch (error) {
    console.error("Error checking/creating profit margin rate:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
