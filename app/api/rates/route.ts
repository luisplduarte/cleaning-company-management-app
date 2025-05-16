import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createRateSchema } from "@/lib/validations/rate";

export async function GET() {
  try {
    const rates = await prisma.rate.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return Response.json(rates);
  } catch (error) {
    console.error("[RATES_GET]", error);
    return new Response("Internal server error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const body = createRateSchema.parse(json);

    const rate = await prisma.rate.create({
      data: body,
    });

    revalidatePath("/rates");
    return Response.json(rate);
  } catch (error) {
    console.error("[RATES_POST]", error);
    return new Response("Invalid request", { status: 400 });
  }
}
