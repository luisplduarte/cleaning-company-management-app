import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { systemRateSchema } from "@/app/(authenticated)/rates/utils/validations";

export async function GET() {
  try {
    const rate = await prisma.rate.findFirst({
      where: { name: "Company Profit Margin" },
    });

    if (!rate) {
      return Response.json(
        { error: "Profit margin rate not found" },
        { status: 404 }
      );
    }

    return Response.json(rate);
  } catch (error) {
    console.error("Error fetching profit margin rate:", error);
    return Response.json(
      { error: "Failed to fetch profit margin rate" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const json = await req.json();
    const body = systemRateSchema.parse(json);

    const profitMarginRate = await prisma.rate.findFirst({
      where: {
        name: "Company Profit Margin",
        is_system: true
      },
    });

    if (!profitMarginRate) {
      return Response.json(
        { error: "Profit margin rate not found" },
        { status: 404 }
      );
    }

    const updatedRate = await prisma.rate.update({
      where: { id: profitMarginRate.id },
      data: {
        value: body.value,
      },
    });

    return Response.json(updatedRate);
  } catch (error) {
    console.error("Error updating profit margin rate:", error);
    if (error instanceof Error) {
      return Response.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return Response.json(
      { error: "Failed to update profit margin rate" },
      { status: 500 }
    );
  }
}
