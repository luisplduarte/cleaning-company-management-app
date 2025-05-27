import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";

// Cache duration in seconds (5 minutes)
const CACHE_DURATION = 300;
import { createRateSchema } from "@/lib/validations/rate";

export async function GET() {
  try {
    // Cache key based on current hour to refresh hourly
    const cacheKey = `rates-${new Date().toISOString().slice(0, 13)}`;

    // Get cached data or fetch new data
    const data = await unstable_cache(
      async () => {
        const rates = await prisma.rate.findMany({
          orderBy: {
            name: "asc",
          },
        });

        // Convert Date objects to ISO strings for JSON serialization
        return rates.map(rate => ({
          ...rate,
          created_at: rate.created_at.toISOString(),
          updated_at: rate.updated_at.toISOString(),
        }));
      },
    [cacheKey],
    {
      revalidate: CACHE_DURATION,
      tags: ['rates'],
    })();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error("[RATES_GET]", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch rates" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const body = createRateSchema.parse(json);

    const rate = await prisma.rate.create({
      data: body,
    });

    // Convert Date objects to ISO strings for JSON serialization
    const serializedRate = {
      ...rate,
      created_at: rate.created_at.toISOString(),
      updated_at: rate.updated_at.toISOString(),
    };

    revalidatePath("/rates");
    return Response.json(serializedRate);
  } catch (error) {
    console.error("[RATES_POST]", error);
    return new Response("Invalid request", { status: 400 });
  }
}
