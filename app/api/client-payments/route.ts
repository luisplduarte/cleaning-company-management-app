import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const payments = await prisma.clientPayment.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            start_date: true,
            end_date: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching client payments:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
