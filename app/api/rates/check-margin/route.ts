import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let rate = await prisma.rate.findFirst({
      where: { name: "Company Profit Margin" },
    });

    // If no margin rate exists, create the default one
    if (!rate) {
      rate = await prisma.rate.create({
        data: {
          name: "Company Profit Margin",
          description: "Default company profit margin applied to worker payments to calculate client payments",
          value: 0.3,
          is_system: true,
        },
      });
    }

    // Handle the case where creation fails
    if (!rate) {
      throw new Error("Failed to get or create profit margin rate");
    }

    // Convert dates to ISO strings for consistent serialization
    const serializedRate = {
      ...rate,
      created_at: rate.created_at.toISOString(),
      updated_at: rate.updated_at.toISOString(),
    };

    return NextResponse.json(serializedRate);
  } catch (error) {
    console.error("[RATE_MARGIN_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
